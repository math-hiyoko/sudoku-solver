#include "solver/SudokuSolver.hpp"

#include <array>
#include <boost/pool/object_pool.hpp>
#include <memory>
#include <vector>

#include "solver/ColumnNode.hpp"
#include "solver/DancingNode.hpp"
#include "solver/HeaderNode.hpp"
#include "solver/RowNode.hpp"
#include "solver/SudokuType.hpp"

namespace {
/**
 * @brief 数独の盤面を表す行列被覆問題の行列
 *
 * 何も数字が入っていないときの数独の盤面の状態を表す行列被覆問題の行列を表す
 */
consteval Sudoku::ExactCoverMatrix makeFullMatrix() {
  Sudoku::ExactCoverMatrix matrix{};

  for (int row = 0, idx = 0; row < Sudoku::SIZE; row++) {
    for (int column = 0; column < Sudoku::SIZE; column++) {
      for (int number = 0; number < Sudoku::SIZE; number++, idx++) {
        // (row, column)マスにnumber+1を入れるとき
        // idxは連番でついている
        matrix[idx][0] = Sudoku::Constraint{
            .type = Sudoku::ConstraintEnum::OCCUPIED,
            .key1 = row,
            .key2 = column,
        };  // (row, column)マスに何か数字が入ること
        matrix[idx][1] = Sudoku::Constraint{
            .type = Sudoku::ConstraintEnum::ROW,
            .key1 = row,
            .key2 = number,
        };  // 行rowにnumber+1が入ること
        matrix[idx][2] = Sudoku::Constraint{
            .type = Sudoku::ConstraintEnum::COLUMN,
            .key1 = column,
            .key2 = number,
        };  // 列columnにnumber+1が入ること
        matrix[idx][3] =
            Sudoku::Constraint{.type = Sudoku::ConstraintEnum::BLOCK,
                               .key1 = row / Sudoku::DIM * Sudoku::DIM + column / Sudoku::DIM,
                               .key2 = number};  // ブロックにnumber+1が入ること
      }
    }
  }

  return matrix;
}  // makeFullMatrix

/**
 * @brief 現在の数独の盤面の状態を表す行列被覆問題のノードを生成する
 *
 * @param board 数独の盤面
 * @param header 行列被覆問題のヘッダー
 * @param dancing_node_pool DancingNodeのプール
 * @param row_node_pool RowNodeのプール
 * @param column_node_pool ColumnNodeのプール
 * @return HeaderNode* 生成したノードのヘッダー
 */
void makeNodesFromBoard(const Sudoku::Board& board, DancingLinks::HeaderNode* header,
                        boost::object_pool<DancingLinks::DancingNode>& dancing_node_pool,
                        boost::object_pool<DancingLinks::RowNode>& row_node_pool,
                        boost::object_pool<DancingLinks::ColumnNode>& column_node_pool) {
  assert(header != nullptr);

  // ColumnNodeを生成
  std::array<DancingLinks::ColumnNode*, Sudoku::EXACT_COVER_COL> column_nodes{};
  for (int i = 0; i < Sudoku::EXACT_COVER_COL; i++) {
    // iに対応する列のノードを生成
    column_nodes[i] = column_node_pool.construct();
    header->hookLeft(column_nodes[i]);
  }

  // あり得る選択肢かどうかのフラグを設定する
  // ある数字が特定のマスに入る場合、同じ列、行、ブロックにその数字が入らないことが決まっている
  std::array<std::array<std::array<bool, Sudoku::SIZE>, Sudoku::SIZE>, Sudoku::SIZE> unfeasible{};
  for (int row = 0; row < Sudoku::SIZE; row++) {
    for (int column = 0; column < Sudoku::SIZE; column++) {
      for (int number = 0; number < Sudoku::SIZE; number++) {
        if (board[row][column] == 0) {
          continue;
        }
        for (int n_row = 0; n_row < Sudoku::SIZE; n_row++) {
          // 同じ列にnumber+1が入らない
          if (n_row != row) {
            unfeasible[n_row][column][board[row][column] - 1] = true;
          }
        }
        for (int n_column = 0; n_column < Sudoku::SIZE; n_column++) {
          // 同じ行にnumber+1が入らない
          if (n_column != column) {
            unfeasible[row][n_column][board[row][column] - 1] = true;
          }
        }
        for (int n_row = row / Sudoku::DIM * Sudoku::DIM;
             n_row < (row / Sudoku::DIM + 1) * Sudoku::DIM; n_row++) {
          for (int n_column = column / Sudoku::DIM * Sudoku::DIM;
               n_column < (column / Sudoku::DIM + 1) * Sudoku::DIM; n_column++) {
            // 同じブロックにnumber+1が入らない
            if (n_row != row && n_column != column) {
              unfeasible[n_row][n_column][board[row][column] - 1] = true;
            }
          }
        }
      }
    }
  }

  // DancingNodeを生成
  constexpr Sudoku::ExactCoverMatrix matrix = makeFullMatrix();
  for (int row = 0, idx = 0; row < Sudoku::SIZE; row++) {
    for (int column = 0; column < Sudoku::SIZE; column++) {
      for (int number = 0; number < Sudoku::SIZE; number++, idx++) {
        // (row, column)にnumber+1が入らないことが決まっている場合はスキップ
        if (unfeasible[row][column][number]) {
          continue;
        }
        // (row, column)マスにnumber+1が入るとき
        // RowNodeを生成し、横につなげる
        DancingLinks::RowNode* row_node = row_node_pool.construct(
            Sudoku::Option::getId(Sudoku::Option{.row = row, .column = column, .number = number}));
        DancingLinks::DancingNode* row_node_front = nullptr;
        for (int i = 0; i < static_cast<int>(Sudoku::ConstraintEnum::ENUM_COUNT); i++) {
          // このConstraintに対応する列のノードを取得
          int column_id = Sudoku::Constraint::getId(matrix[idx][i]);
          DancingLinks::ColumnNode* column_node = column_nodes[column_id];
          DancingLinks::DancingNode* dancing_node =
              dancing_node_pool.construct(row_node, column_node);
          // DancingNodeを行列につなげる
          column_node->hookUp(dancing_node);
          column_node->size++;
          if (row_node_front == nullptr) [[unlikely]] {
            row_node_front = dancing_node;
          }
          row_node_front->hookLeft(dancing_node);
        }
      }
    }
  }

  return;
}  // makeNodesFromBoard

/**
 * @brief knuths_algorithmによってえられたDancingNodeから数独の盤面を復元する
 *
 * @param solution knuths_algorithmによってえられたRowNode
 * @param board 復元した数独の盤面
 */
void makeBoardFromSolution(const std::vector<DancingLinks::RowNode*>& solution,
                           Sudoku::Board& board) {
  board = Sudoku::Board{};
  for (const DancingLinks::RowNode* row_node : solution) {
    Sudoku::Option option = Sudoku::Option::getOption(row_node->option_id);
    board[option.row][option.column] = option.number + 1;
  }

  return;
}  // makeBoardFromSolution
}  // namespace

namespace Sudoku {
void solve(const Board& board, Board& solution, int& num_solutions, bool& is_exact_num_solutions,
           const bool just_solution, const int max_num_solutions) {
  // 行列被覆問題を表すheaderを生成
  // DancingNodeは行あたり4つ、ColumnNodeは列あたり1つ生成される
  boost::object_pool<DancingLinks::DancingNode> dancing_node_pool(
      EXACT_COVER_ROW * static_cast<int>(ConstraintEnum::ENUM_COUNT));
  boost::object_pool<DancingLinks::RowNode> row_node_pool(EXACT_COVER_ROW);
  boost::object_pool<DancingLinks::ColumnNode> column_node_pool(EXACT_COVER_COL);
  std::unique_ptr<DancingLinks::HeaderNode> header(new DancingLinks::HeaderNode());
  makeNodesFromBoard(board, header.get(), dancing_node_pool, row_node_pool, column_node_pool);

  // 行列被覆問題を解く
  num_solutions = 0;
  std::vector<DancingLinks::RowNode*> solution_nodes;
  solution_nodes.reserve(SIZE * SIZE);
  header->knuths_algorithm(solution_nodes, num_solutions, is_exact_num_solutions, just_solution,
                           max_num_solutions);

  // 解が存在する場合、解を復元する
  makeBoardFromSolution(solution_nodes, solution);

  return;
}  // solve
}  // namespace Sudoku
