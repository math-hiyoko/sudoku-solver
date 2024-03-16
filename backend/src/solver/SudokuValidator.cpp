#include "solver/SudokuValidator.hpp"

#include <array>
#include <vector>

namespace Sudoku {
int countFilled(const Board &board) {
  int count = 0;
  for (int i = 0; i < SIZE; i++) {
    for (int j = 0; j < SIZE; j++) {
      if (board[i][j] != 0) {
        count++;
      }
    }
  }
  return count;
}  // countFilled

int isValidRange(const Board &board, std::vector<Constraint> &constraints) {
  for (int i = 0; i < SIZE; i++) {
    for (int j = 0; j < SIZE; j++) {
      if (board[i][j] < 0 || board[i][j] > SIZE) {
        constraints.push_back(Constraint{ConstraintEnum::OCCUPIED, i, j});
      }
    }
  }
  return constraints.size();
}  // isValidRange

int isSatisfy(const Board &board, std::vector<Constraint> &constraints) {
  // 行についてのチェック
  for (int i = 0; i < SIZE; i++) {
    // check[v] は v+1 がi行目に出現する回数を表す
    std::array<int, SIZE> check{};
    for (int j = 0; j < SIZE; j++) {
      if (board[i][j] == 0) {
        continue;
      }
      check[board[i][j] - 1]++;
    }
    // 出現回数が2以上のものがあれば制約を満たさない
    for (int value = 1; value <= SIZE; value++) {
      if (check[value - 1] > 1) {
        constraints.push_back(Constraint{ConstraintEnum::ROW, i, value});
      }
    }
  }  // 行についてのチェック

  // 列についてのチェック
  for (int j = 0; j < SIZE; j++) {
    // check[v] は v+1 がi列目に出現する回数を表す
    std::array<int, SIZE> check{};
    for (int i = 0; i < SIZE; i++) {
      if (board[i][j] == 0) {
        continue;
      }
      check[board[i][j] - 1]++;
    }
    // 出現回数が2以上のものがあれば制約を満たさない
    for (int value = 1; value <= SIZE; value++) {
      if (check[value - 1] > 1) {
        constraints.push_back(Constraint{ConstraintEnum::COLUMN, j, value});
      }
    }
  }  // 列についてのチェック

  // ブロックについてのチェック
  for (int i = 0; i < DIM; i++) {
    for (int j = 0; j < DIM; j++) {
      // check[v] は v+1 が(i, j)ブロックに出現する回数を表す
      std::array<int, SIZE> check{};
      // (i, j)ブロック内の各マスについてチェック
      for (int k = 0; k < DIM; k++) {
        for (int l = 0; l < DIM; l++) {
          if (board[i * DIM + k][j * DIM + l] == 0) {
            continue;
          }
          check[board[i * DIM + k][j * DIM + l] - 1]++;
        }
      }
      // 出現回数が2以上のものがあれば制約を満たさない
      for (int value = 1; value <= SIZE; value++) {
        if (check[value - 1] > 1) {
          constraints.push_back(Constraint{ConstraintEnum::BLOCK, i * DIM + j, value});
        }
      }
    }
  }  // ブロックについてのチェック

  return constraints.size();
}  // isSatisfy
}  // namespace Sudoku
