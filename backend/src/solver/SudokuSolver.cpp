#include "SudokuSolver.hpp"

#include <array>
#include <iostream>
#include <memory>
#include <vector>

#include <boost/pool/object_pool.hpp>

#include "ColumnNode.hpp"
#include "DancingNode.hpp"
#include "HeaderNode.hpp"
#include "KnuthsAlgorithm.hpp"
#include "SudokuType.hpp"


consteval ExactCoverMatrix makeFullMatrix() {
    ExactCoverMatrix matrix{};
    
    for (int row = 0, idx = 0; row < SUDOKU_SIZE; row++) {
        for (int column = 0; column < SUDOKU_SIZE; column++) {
            for (int number = 0; number < SUDOKU_SIZE; number++, idx++) {
                // (row, column)マスにnumber+1を入れるとき
                // idxは連番でついている
                matrix[idx][0] = Constraint{ConstraintEnum::OCCUPIED, row, column};   // (row, column)マスに何か数字が入ること
                matrix[idx][1] = Constraint{ConstraintEnum::ROW, row, number};        // 行rowにnumber+1が入ること
                matrix[idx][2] = Constraint{ConstraintEnum::COLUMN, column, number};  // 列columnにnumber+1が入ること
                matrix[idx][3] = Constraint{ConstraintEnum::BLOCK, row / SUDOKU_DIM * SUDOKU_DIM + column / SUDOKU_DIM, number};  // ブロックにnumber+1が入ること
            }
        }
    }

    return matrix;
}

void makeNodesFromBoard(const SudokuBoard& board, HeaderNode* header, boost::object_pool<DancingNode>& dancing_node_pool, boost::object_pool<ColumnNode>& column_node_pool) {
    assert(header != nullptr);

    // ColumnNodeを生成
    std::array<ColumnNode*, EXACT_COVER_COL> column_nodes{};
    for (int i = 0; i < EXACT_COVER_COL; i++) {
        // iに対応する列のノードを生成
        column_nodes[i] = column_node_pool.construct(i);
        header->left->hookRight(column_nodes[i]);
    }

    // DancingNodeを生成
    constexpr ExactCoverMatrix matrix = makeFullMatrix();
    for (int row = 0, idx = 0; row < SUDOKU_SIZE; row++) {
        for (int column = 0; column < SUDOKU_SIZE; column++) {
            for (int number = 0; number < SUDOKU_SIZE; number++, idx++) {
                // (row, column)の数字がすでに決まっており、number+1が入らない時はスキップ
                if (board[row][column] != 0 && board[row][column] - 1 != number) {
                    continue;
                }
                // (row, column)マスにnumber+1が入るとき
                // DancingNodeを生成し、行列につなげる
                std::array<DancingNode*, static_cast<int>(ConstraintEnum::ENUM_COUNT)> dancing_nodes{};
                for (int i = 0; i < static_cast<int>(ConstraintEnum::ENUM_COUNT); i++) {
                    // このConstraintに対応する列のノードを取得
                    int column_id = Constraint::getId(matrix[idx][i]);
                    ColumnNode* column_node = column_nodes[column_id];
                    dancing_nodes[i] = dancing_node_pool.construct(column_node);
                    // DancingNodeを行列につなげる
                    column_node->up->hookDown(dancing_nodes[i]);
                    column_node->size++;
                    if (i > 0) {
                        dancing_nodes[i - 1]->hookRight(dancing_nodes[i]);
                    }
                }
            }
        }
    }

    return;
}

void makeBoardFromAnswer(const std::vector<DancingNode*>& answer, SudokuBoard& board) {
    board = SudokuBoard{};
    for (const DancingNode* node : answer) {
        // 選ばれたノードが属する行のノードから情報を取り出す
        int row = -1;
        int column = -1;
        int number = -1;
        for (DancingNode* row_node = node->right; row_node != node; row_node = row_node->right) {
            int constraint_id = row_node->column->id;
            Constraint constraint = Constraint::getConstraint(constraint_id);
            switch (constraint.type) {
                case ConstraintEnum::OCCUPIED:
                    row = constraint.key1;
                    column = constraint.key2;
                    break;
                case ConstraintEnum::ROW:
                    row = constraint.key1;
                    number = constraint.key2;
                    break;
                case ConstraintEnum::COLUMN:
                    column = constraint.key1;
                    number = constraint.key2;
                    break;
                case ConstraintEnum::BLOCK:
                    number = constraint.key2;
                    break;
                default:
                    assert(false);
                    break;
            }
        }
        
        assert(row != -1 && column != -1 && number != -1);
        board[row][column] = number + 1;
    }

    return;
}

void solveSudoku(const SudokuBoard& board, int& num_answer, SudokuBoard& answer) {
    // 行列被覆問題を表すheaderを生成
    // DancingNodeは行あたり4つ、ColumnNodeは列あたり1つ生成される
    boost::object_pool<DancingNode> dancing_node_pool(EXACT_COVER_ROW * static_cast<int>(ConstraintEnum::ENUM_COUNT));
    boost::object_pool<ColumnNode> column_node_pool(EXACT_COVER_COL);
    std::unique_ptr<HeaderNode> header(new HeaderNode());
    makeNodesFromBoard(board, header.get(), dancing_node_pool, column_node_pool);

    // 行列被覆問題を解く
    num_answer = 0;
    std::vector<DancingNode*> answer_nodes;
    answer_nodes.reserve(SUDOKU_SIZE * SUDOKU_SIZE);
    knuths_algorithm(header.get(), num_answer, answer_nodes);
    
    // 解が存在する場合、解を復元する
    makeBoardFromAnswer(answer_nodes, answer);

    return;
}
