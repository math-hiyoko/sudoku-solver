#include "solver/SudokuValidator.hpp"

#include <array>
#include <set>
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

int isSatisfy(const Board &board, std::vector<Option> &options) {
  std::set<Option> options_set;
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
    for (int j = 0; j < SIZE; j++) {
      if (board[i][j] == 0) {
        continue;
      }
      if (check[board[i][j] - 1] > 1) {
        options_set.insert(Option{.row = i, .column = j, .number = board[i][j]});
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
    for (int i = 0; i < SIZE; i++) {
      if (board[i][j] == 0) {
        continue;
      }
      if (check[board[i][j] - 1] > 1) {
        options_set.insert(Option{.row = i, .column = j, .number = board[i][j]});
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
      for (int k = 0; k < DIM; k++) {
        for (int l = 0; l < DIM; l++) {
          if (board[i * DIM + k][j * DIM + l] == 0) {
            continue;
          }
          if (check[board[i * DIM + k][j * DIM + l] - 1] > 1) {
            options_set.insert(Option{.row = i * DIM + k,
                                      .column = j * DIM + l,
                                      .number = board[i * DIM + k][j * DIM + l]});
          }
        }
      }
    }
  }  // ブロックについてのチェック

  options.assign(options_set.begin(), options_set.end());

  return options.size();
}  // isSatisfy
}  // namespace Sudoku
