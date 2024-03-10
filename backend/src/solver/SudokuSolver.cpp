#include <array>
#include <vector>

#include <boost/pool/object_pool.hpp>

#include "ColumnNode.hpp"
#include "DancingNode.hpp"
#include "HeaderNode.hpp"
#include "SudokuSolver.hpp"
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

HeaderNode* makeNodesFromMatrix(const ExactCoverMatrix& matrix, boost::object_pool<DancingNode>& dancing_node_pool, boost::object_pool<ColumnNode>& column_node_pool) {
    HeaderNode* header = &HeaderNode();
    std::vector<ColumnNode*> column_nodes(EXACT_COVER_COL);

    for (int i = 0; i < EXACT_COVER_COL; i++) {
        // このときの制約
        int constraint = i / (SUDOKU_SIZE * SUDOKU_SIZE);
        int key1 = (i  / SUDOKU_SIZE) % SUDOKU_SIZE;
        int key2 = i % SUDOKU_SIZE;
        // iに対応する列のノードを生成
        column_nodes[i] = column_node_pool.construct(ConstraintType{static_cast<ConstraintEnum>(constraint), key1, key2});
        // 最後に作成したノードの右隣に生成したノードを繋げる
        header->left->hookRight(column_nodes[i]);
        // ヘッダーノードにも繋げる
        column_nodes[i]->hookRight(header);
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

    return header;
}

void makeBoardFromAnswer(const std::vector<DancingNode*>& answer, SudokuBoard& board) {
    board = SudokuBoard{};
    for (const DancingNode* node : answer) {
        // 選ばれたノードが属する行のノードから情報を取り出す
        int row = -1;
        int column = -1;
        int number = -1;
        for (DancingNode* row_node = node->right; row_node->left != node; row_node = row_node->right) {
            auto [constraint, key1, key2] = row_node->column->constraint;
            switch (constraint) {
                case ConstraintEnum::OCCUPIED:
                    row = key1;
                    column = key2;
                    break;
                case ConstraintEnum::ROW:
                    row = key1;
                    number = key2;
                    break;
                case ConstraintEnum::COLUMN:
                    column = key1;
                    number = key2;
                    break;
                case ConstraintEnum::BLOCK:
                    number = key2;
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
    boost::object_pool<DancingNode> dancing_node_pool;
    boost::object_pool<ColumnNode> column_node_pool;
    HeaderNode* header = makeNodesFromMatrix(matrix, dancing_node_pool, column_node_pool);

    // 行列被覆問題を解く
    num_answer = 0;
    std::vector<DancingNode*> answer_nodes;
    knuths_algorithm(header, num_answer, answer_nodes);
    
    // 解が存在する場合、解を復元する
    makeBoardFromAnswer(answer_nodes, answer);

    return;
}
