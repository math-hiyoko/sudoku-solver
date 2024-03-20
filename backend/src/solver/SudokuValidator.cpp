#include "solver/SudokuValidator.hpp"

#include <array>
#include <vector>

namespace Sudoku {
int isValidRange(const Board &board, std::vector<Option> &options) {
  for (int i = 0; i < SIZE; i++) {
    for (int j = 0; j < SIZE; j++) {
      if (board[i][j] < 0 || board[i][j] > SIZE) {
        options.push_back(Option{.row = i, .column = j, .number = board[i][j]});
      }
    }
  }
  return options.size();
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
        constraints.push_back(Constraint{.type = ConstraintEnum::ROW, .key1 = i, .key2 = value});
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
        constraints.push_back(Constraint{.type = ConstraintEnum::COLUMN, .key1 = j, .key2 = value});
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
          constraints.push_back(
              Constraint{.type = ConstraintEnum::BLOCK, .key1 = i * DIM + j, .key2 = value});
        }
      }
    }
  }  // ブロックについてのチェック

  return constraints.size();
}  // isSatisfy
}  // namespace Sudoku
