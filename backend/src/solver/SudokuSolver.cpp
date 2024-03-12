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


consteval ExactCoverMatrix makeFullMatrix() {
    ExactCoverMatrix matrix{};
    
    for (int row = 0, idx = 0; row < SUDOKU_SIZE; row++) {
        for (int column = 0; column < SUDOKU_SIZE; column++) {
            for (int number = 0; number < SUDOKU_SIZE; number++, idx++) {
                // (row, column)マスにnumber+1を入れるとき
                // idxは連番でついている
                matrix[idx][0] = SudokuConstraint{SudokuConstraintEnum::OCCUPIED, row, column};   // (row, column)マスに何か数字が入ること
                matrix[idx][1] = SudokuConstraint{SudokuConstraintEnum::ROW, row, number};        // 行rowにnumber+1が入ること
                matrix[idx][2] = SudokuConstraint{SudokuConstraintEnum::COLUMN, column, number};  // 列columnにnumber+1が入ること
                matrix[idx][3] = SudokuConstraint{SudokuConstraintEnum::BLOCK, row / SUDOKU_DIM * SUDOKU_DIM + column / SUDOKU_DIM, number};  // ブロックにnumber+1が入ること
            }
        }
    }

    return matrix;
}

void makeNodesFromBoard(const SudokuBoard& board, HeaderNode* header, boost::object_pool<DancingNode>& dancing_node_pool, boost::object_pool<RowNode>& row_node_pool, boost::object_pool<ColumnNode>& column_node_pool) {
    assert(header != nullptr);

    // ColumnNodeを生成
    std::array<ColumnNode*, EXACT_COVER_COL> column_nodes{};
    for (int i = 0; i < EXACT_COVER_COL; i++) {
        // iに対応する列のノードを生成
        column_nodes[i] = column_node_pool.construct();
        header->left->hookRight(column_nodes[i]);
    }

    // DancingNodeを生成
    constexpr ExactCoverMatrix matrix = makeFullMatrix();
    for (int row = 0, idx = 0; row < SUDOKU_SIZE; row++) {
        for (int column = 0; column < SUDOKU_SIZE; column++) {
            for (int number = 0; number < SUDOKU_SIZE; number++, idx++) {
                // (row, column)にnumber+1が入らないことが決まっている場合はスキップ
                if (board[row][column] != 0 && board[row][column] - 1 != number) {
                    continue;
                }
                // (row, column)マスにnumber+1が入るとき
                // RowNodeを生成し、横につなげる
                RowNode* row_node = row_node_pool.construct(SudokuOption::getId(SudokuOption{row, column, number}));
                for (int i = 0; i < static_cast<int>(SudokuConstraintEnum::ENUM_COUNT); i++) {
                    // このSudokuConstraintに対応する列のノードを取得
                    int column_id = SudokuConstraint::getId(matrix[idx][i]);
                    ColumnNode* column_node = column_nodes[column_id];
                    DancingNode* dancing_node = dancing_node_pool.construct(row_node, column_node);
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
}

void makeBoardFromAnswer(const std::vector<RowNode*>& answer, SudokuBoard& board) {
    board = SudokuBoard{};
    for (const RowNode* row_node : answer) {
        SudokuOption option = SudokuOption::getSudokuOption(row_node->option_id);
        board[option.row][option.column] = option.number + 1;
    }

    return;
}

void solveSudoku(const SudokuBoard& board, int& num_answer, SudokuBoard& answer) {
    // 行列被覆問題を表すheaderを生成
    // DancingNodeは行あたり4つ、ColumnNodeは列あたり1つ生成される
    boost::object_pool<DancingNode> dancing_node_pool(EXACT_COVER_ROW * static_cast<int>(SudokuConstraintEnum::ENUM_COUNT));
    boost::object_pool<RowNode> row_node_pool(EXACT_COVER_ROW);
    boost::object_pool<ColumnNode> column_node_pool(EXACT_COVER_COL);
    std::unique_ptr<HeaderNode> header(new HeaderNode());
    makeNodesFromBoard(board, header.get(), dancing_node_pool, row_node_pool, column_node_pool);

    // 行列被覆問題を解く
    num_answer = 0;
    std::vector<RowNode*> answer_nodes;
    answer_nodes.reserve(SUDOKU_SIZE * SUDOKU_SIZE);
    knuths_algorithm(header.get(), num_answer, answer_nodes);
    
    // 解が存在する場合、解を復元する
    makeBoardFromAnswer(answer_nodes, answer);

    return;
}
