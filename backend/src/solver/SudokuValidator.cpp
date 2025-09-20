#include "solver/SudokuValidator.hpp"

#include <array>
#include <set>
#include <vector>

namespace Sudoku {
int isValidRange(const Board &board, std::vector<Option> &options) {
  for (int i = 0; i < SIZE; i++) {
    for (int j = 0; j < SIZE; j++) {
      if (board[i][j] < 0 || board[i][j] > SIZE) {
        options.emplace_back(Option{.row = i, .column = j, .number = board[i][j]});
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
  for (int i = 0; i < LEVEL; i++) {
    for (int j = 0; j < LEVEL; j++) {
      // check[v] は v+1 が(i, j)ブロックに出現する回数を表す
      std::array<int, SIZE> check{};
      // (i, j)ブロック内の各マスについてチェック
      for (int k = 0; k < LEVEL; k++) {
        for (int l = 0; l < LEVEL; l++) {
          if (board[i * LEVEL + k][j * LEVEL + l] == 0) {
            continue;
          }
          check[board[i * LEVEL + k][j * LEVEL + l] - 1]++;
        }
      }
      // 出現回数が2以上のものがあれば制約を満たさない
      for (int k = 0; k < LEVEL; k++) {
        for (int l = 0; l < LEVEL; l++) {
          if (board[i * LEVEL + k][j * LEVEL + l] == 0) {
            continue;
          }
          if (check[board[i * LEVEL + k][j * LEVEL + l] - 1] > 1) {
            options_set.insert(Option{.row = i * LEVEL + k,
                                      .column = j * LEVEL + l,
                                      .number = board[i * LEVEL + k][j * LEVEL + l]});
          }
        }
      }
    }
  }  // ブロックについてのチェック

  options.assign(options_set.begin(), options_set.end());

  return options.size();
}  // isSatisfy

int isCorrect(const Board &board, bool &is_correct) {
  // 数独の制約を満たしているか確認
  std::vector<Option> options;
  int num_invalid = isSatisfy(board, options);
  if (num_invalid != 0) {
    is_correct = false;
    return num_invalid;
  }
  // すべてのマスに数字が入っているか確認
  is_correct = true;
  for (int i = 0; i < SIZE; i++) {
    for (int j = 0; j < SIZE; j++) {
      if (board[i][j] == 0) {
        is_correct = false;
        num_invalid++;
      }
    }
  }

  return num_invalid;
}  // isCorrect
}  // namespace Sudoku
