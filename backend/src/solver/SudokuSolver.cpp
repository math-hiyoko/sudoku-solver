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


constexpr int getIdx(int key1, int key2, int key3) {
    return key1 * SUDOKU_SIZE * SUDOKU_SIZE + key2 * SUDOKU_SIZE + key3;
}

consteval ExactCoverMatrix makeFullMatrix() {
    ExactCoverMatrix matrix{};
    
    for (int row = 0; row < SUDOKU_SIZE; row++) {
        for (int column = 0; column < SUDOKU_SIZE; column++) {
            for (int number = 0; number < SUDOKU_SIZE; number++) {
                // (row, column)マスにnumber+1を入れるとき
                const int idx = getIdx(row, column, number);
                matrix[idx][getIdx(0, row, column)] = true;  // (row, column)マスに何か数字が入ること
                matrix[idx][getIdx(1, row, number)] = true;  // 行rowにnumber+1が入ること
                matrix[idx][getIdx(2, column, number)] = true;  // 列columnにnumber+1が入ること
                matrix[idx][getIdx(3, row / SUDOKU_DIM * SUDOKU_DIM + column / SUDOKU_DIM, number)] = true;  // ブロックにnumber+1が入ること
            }
        }
    }

    return matrix;
}

void makeMatrixFromBoard(const SudokuBoard& board, ExactCoverMatrix& matrix) {
    matrix = makeFullMatrix();

    for (int row = 0; row < SUDOKU_SIZE; row++) {
        for (int column = 0; column < SUDOKU_SIZE; column++) {
            if (board[row][column] == 0) {
                continue;
            }
            int number = board[row][column] - 1;
            // マス(row, column)にはnumber+1が入ることが確定している
            // それ以外の数字が入ることはないので、それに対応する制約を削除する
            for (int i = 0; i < SUDOKU_SIZE; i++) {
                if (number == i) {
                    continue;
                }
                int idx = getIdx(row, column, i);
                matrix[idx][getIdx(0, row, column)] = false;
                matrix[idx][getIdx(1, row, number)] = false;
                matrix[idx][getIdx(2, column, number)] = false;
                matrix[idx][getIdx(3, row / SUDOKU_DIM * SUDOKU_DIM + column / SUDOKU_DIM, i)] = false;
            }
        }
    }

    return;
}

void makeNodesFromMatrix(const ExactCoverMatrix& matrix, HeaderNode* header, boost::object_pool<DancingNode>& dancing_node_pool, boost::object_pool<ColumnNode>& column_node_pool) {
    assert(header != nullptr);
    std::array<ColumnNode*, EXACT_COVER_COL> column_nodes{};

    for (int i = 0; i < EXACT_COVER_COL; i++) {
        // iに対応する列のノードを生成
        column_nodes[i] = column_node_pool.construct(i);
        header->left->hookRight(column_nodes[i]);
    }

    for (int i = 0; i < EXACT_COVER_ROW; i++) {
        DancingNode* prev = nullptr;
        for (int j = 0; j < EXACT_COVER_COL; j++) {
            if (!matrix[i][j]) {
                continue;
            }
            ColumnNode* column = column_nodes[j];
            DancingNode* node = dancing_node_pool.construct(column);
            if (prev == nullptr) {
                prev = node;
            }
            column->up->hookDown(node);
            prev = prev->hookRight(node);
            column->size++;
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
            }
        }
        
        assert(row != -1 && column != -1 && number != -1);
        board[row][column] = number + 1;
    }

    return;
}

void solveSudoku(const SudokuBoard& board, int& num_answer, SudokuBoard& answer) {
    // 数独の盤面に対応する行列被覆問題の行列を生成
    ExactCoverMatrix matrix;
    makeMatrixFromBoard(board, matrix);

    // 行列被覆問題を表すheaderを生成
    // DancingNodeは行あたり4つ、ColumnNodeは列あたり1つ生成される
    boost::object_pool<DancingNode> dancing_node_pool(EXACT_COVER_ROW * 4);
    boost::object_pool<ColumnNode> column_node_pool(EXACT_COVER_COL);
    std::unique_ptr<HeaderNode> header(new HeaderNode());
    makeNodesFromMatrix(matrix, header.get(), dancing_node_pool, column_node_pool);

    // 行列被覆問題を解く
    num_answer = 0;
    std::vector<DancingNode*> answer_nodes;
    answer_nodes.reserve(SUDOKU_SIZE * SUDOKU_SIZE);
    knuths_algorithm(header.get(), num_answer, answer_nodes);
    
    // 解が存在する場合、解を復元する
    makeBoardFromAnswer(answer_nodes, answer);

    return;
}
