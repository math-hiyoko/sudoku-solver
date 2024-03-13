#include "SudokuSolver.hpp"

#include <array>
#include <memory>
#include <vector>

#include <boost/pool/object_pool.hpp>

#include "ColumnNode.hpp"
#include "DancingNode.hpp"
#include "HeaderNode.hpp"
#include "KnuthsAlgorithm.hpp"
#include "RowNode.hpp"
#include "SudokuType.hpp"


namespace Sudoku {
    consteval ExactCoverMatrix makeFullMatrix() {
        ExactCoverMatrix matrix{};
        
        for (int row = 0, idx = 0; row < SIZE; row++) {
            for (int column = 0; column < SIZE; column++) {
                for (int number = 0; number < SIZE; number++, idx++) {
                    // (row, column)マスにnumber+1を入れるとき
                    // idxは連番でついている
                    matrix[idx][0] = Constraint{ConstraintEnum::OCCUPIED, row, column};   // (row, column)マスに何か数字が入ること
                    matrix[idx][1] = Constraint{ConstraintEnum::ROW, row, number};        // 行rowにnumber+1が入ること
                    matrix[idx][2] = Constraint{ConstraintEnum::COLUMN, column, number};  // 列columnにnumber+1が入ること
                    matrix[idx][3] = Constraint{ConstraintEnum::BLOCK, row / DIM * DIM + column / DIM, number};  // ブロックにnumber+1が入ること
                }
            }
        }

        return matrix;
    } // makeFullMatrix

    void makeNodesFromBoard(const Board& board, DancingLinks::HeaderNode* header, boost::object_pool<DancingLinks::DancingNode>& dancing_node_pool, boost::object_pool<DancingLinks::RowNode>& row_node_pool, boost::object_pool<DancingLinks::ColumnNode>& column_node_pool) {
        assert(header != nullptr);

        // ColumnNodeを生成
        std::array<DancingLinks::ColumnNode*, EXACT_COVER_COL> column_nodes{};
        for (int i = 0; i < EXACT_COVER_COL; i++) {
            // iに対応する列のノードを生成
            column_nodes[i] = column_node_pool.construct();
            header->left->hookRight(column_nodes[i]);
        }

        // DancingNodeを生成
        constexpr ExactCoverMatrix matrix = makeFullMatrix();
        for (int row = 0, idx = 0; row < SIZE; row++) {
            for (int column = 0; column < SIZE; column++) {
                for (int number = 0; number < SIZE; number++, idx++) {
                    // (row, column)にnumber+1が入らないことが決まっている場合はスキップ
                    if (board[row][column] != 0 && board[row][column] - 1 != number) {
                        continue;
                    }
                    // (row, column)マスにnumber+1が入るとき
                    // RowNodeを生成し、横につなげる
                    DancingLinks::RowNode* row_node = row_node_pool.construct(Option::getId(Option{row, column, number}));
                    for (int i = 0; i < static_cast<int>(ConstraintEnum::ENUM_COUNT); i++) {
                        // このConstraintに対応する列のノードを取得
                        int column_id = Constraint::getId(matrix[idx][i]);
                        DancingLinks::ColumnNode* column_node = column_nodes[column_id];
                        DancingLinks::DancingNode* dancing_node = dancing_node_pool.construct(row_node, column_node);
                        // DancingNodeを行列につなげる
                        column_node->up->hookDown(dancing_node);
                        column_node->size++;
                        if (row_node->front == nullptr) {
                            row_node->front = dancing_node;
                        }
                        row_node->front->left->hookRight(dancing_node);
                    }
                }
            }
        }

        return;
    } // makeNodesFromBoard

    void makeBoardFromAnswer(const std::vector<DancingLinks::RowNode*>& answer, Board& board) {
        board = Board{};
        for (const DancingLinks::RowNode* row_node : answer) {
            Option option = Option::getOption(row_node->option_id);
            board[option.row][option.column] = option.number + 1;
        }

        return;
    } // makeBoardFromAnswer

    void solve(const Board& board, Board& answer, int& num_answer, bool &is_exact_num_answer, const bool just_answer, const int max_num_answer) {
        // 行列被覆問題を表すheaderを生成
        // DancingNodeは行あたり4つ、ColumnNodeは列あたり1つ生成される
        boost::object_pool<DancingLinks::DancingNode> dancing_node_pool(EXACT_COVER_ROW * static_cast<int>(ConstraintEnum::ENUM_COUNT));
        boost::object_pool<DancingLinks::RowNode> row_node_pool(EXACT_COVER_ROW);
        boost::object_pool<DancingLinks::ColumnNode> column_node_pool(EXACT_COVER_COL);
        std::unique_ptr<DancingLinks::HeaderNode> header(new DancingLinks::HeaderNode());
        makeNodesFromBoard(board, header.get(), dancing_node_pool, row_node_pool, column_node_pool);

        // 行列被覆問題を解く
        num_answer = 0;
        std::vector<DancingLinks::RowNode*> answer_nodes;
        answer_nodes.reserve(SIZE * SIZE);
        knuths_algorithm(header.get(), answer_nodes, num_answer, is_exact_num_answer, just_answer, max_num_answer);
        
        // 解が存在する場合、解を復元する
        makeBoardFromAnswer(answer_nodes, answer);

        return;
    } // solve
} // namespace Sudoku
