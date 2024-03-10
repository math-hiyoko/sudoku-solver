#include "SudokuValidator.hpp"

#include <array>
#include <vector>


int countFilled(const SudokuBoard &board) {
    int count = 0;
    for (int i = 0; i < SUDOKU_SIZE; i++) {
        for (int j = 0; j < SUDOKU_SIZE; j++) {
            if (board[i][j] != 0) {
                count++;
            }
        }
    }
    return count;
}

int isValidRange(const SudokuBoard &board, std::vector<Constraint> &constraints) {
    for (int i = 0; i < SUDOKU_SIZE; i++) {
        for (int j = 0; j < SUDOKU_SIZE; j++) {
            if (board[i][j] < 0 || board[i][j] > SUDOKU_SIZE) {
                constraints.push_back(Constraint{ConstraintEnum::OCCUPIED, i, j});
            }
        }
    }
    return constraints.size();
}

int isSatisfy(const SudokuBoard &board, std::vector<Constraint> &constraints) {
    // 行についてのチェック
    for (int i = 0; i < SUDOKU_SIZE; i++) {
        // check[v] は v+1 がi行目に出現する回数を表す
        std::array<int, SUDOKU_SIZE> check{};
        for (int j = 0; j < SUDOKU_SIZE; j++) {
            if (board[i][j] == 0) {
                continue;
            }
            check[board[i][j] - 1]++;
        }
        // 出現回数が2以上のものがあれば制約を満たさない
        for (int value = 1; value <= SUDOKU_SIZE; value++) {
            if (check[value - 1] > 1) {
                constraints.push_back(Constraint{ConstraintEnum::ROW, i, value});
            }
        }
    }

    // 列についてのチェック
    for (int j = 0; j < SUDOKU_SIZE; j++) {
        // check[v] は v+1 がi列目に出現する回数を表す
        std::array<int, SUDOKU_SIZE> check{};
        for (int i = 0; i < SUDOKU_SIZE; i++) {
            if (board[i][j] == 0) {
                continue;
            }
            check[board[i][j] - 1]++;
        }
        // 出現回数が2以上のものがあれば制約を満たさない
        for (int value = 1; value <= SUDOKU_SIZE; value++) {
            if (check[value - 1] > 1) {
                constraints.push_back(Constraint{ConstraintEnum::COLUMN, j, value});
            }
        }
    }

    // ブロックについてのチェック
    for (int i = 0; i < SUDOKU_DIM; i++) {
        for (int j = 0; j < SUDOKU_DIM; j++) {
            // check[v] は v+1 が(i, j)ブロックに出現する回数を表す
            std::array<int, SUDOKU_SIZE> check{};
            // (i, j)ブロック内の各マスについてチェック
            for (int k = 0; k < SUDOKU_DIM; k++) {
                for (int l = 0; l < SUDOKU_DIM; l++) {
                    if (board[i * SUDOKU_DIM + k][j * SUDOKU_DIM + l] == 0) {
                        continue;
                    }
                    check[board[i * SUDOKU_DIM + k][j * SUDOKU_DIM + l] - 1]++;
                }
            }
            // 出現回数が2以上のものがあれば制約を満たさない
            for (int value = 1; value <= SUDOKU_SIZE; value++) {
                if (check[value - 1] > 1) {
                    constraints.push_back(Constraint{ConstraintEnum::BLOCK, i * SUDOKU_DIM + j, value});
                }
            }
        }
    }

    return constraints.size();
}