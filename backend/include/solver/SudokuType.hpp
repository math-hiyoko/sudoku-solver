#pragma once

#include <array>

namespace Sudoku {
/**
 * 数独の解の個数の上限
 * 解がこの個数より多くなったら計算を打ち切る
 */
#ifdef SUDOKU_MAX_NUM_SOLUTIONS
constexpr static int MAX_NUM_SOLUTIONS = SUDOKU_MAX_NUM_SOLUTIONS;
#else
constexpr static int MAX_NUM_SOLUTIONS = 100'000'000;
#endif

/**
 * 数独の問題としての次元、3なら9x9の数独、4なら16x16の数独
 * ここの数字を変えるだけで、任意の次元の数独に対応できるように作っている
 */
#ifdef SUDOKU_DIM
constexpr static int DIM = SUDOKU_DIM;
#else
constexpr static int DIM = 3;
#endif

/**
 * 数独の一辺のマスの数
 */
constexpr static int SIZE = DIM * DIM;

/**
 * @brief 数独の盤面を表す型
 */
using Board = std::array<std::array<int, SIZE>, SIZE>;

/**
 * @brief 数独の制約の種類を表す型
 */
enum class ConstraintEnum {
  OCCUPIED,   // マス(i, j)に何か数字が入ること
  ROW,        // 行
  COLUMN,     // 列
  BLOCK,      // ブロック
  ENUM_COUNT  // 要素数を取得するのに使う
};

/**
 * @brief 数独の制約を表す型
 */
struct Constraint {
  ConstraintEnum type;  // 制約の種類
  /**
   * - 制約の種類が OCCUPIED の場合、マス(key1, key2)に数字がはいること
   * - 制約の種類が ROW の場合、行key1に数字key2がはいること
   * - 制約の種類が COLUMN の場合、列key1に数字key2がはいること
   * - 制約の種類が BLOCK の場合、ブロックkey1に数字key2がはいること
   */
  int key1;
  int key2;

  auto operator<=>(const Constraint &) const = default;

  // ConstraintTypeを一意のidに変換する
  static int getId(const Constraint &constraint) {
    return static_cast<int>(constraint.type) * SIZE * SIZE + constraint.key1 * SIZE +
           constraint.key2;
  }

  // idをConstraintTypeに変換する
  static Constraint getConstraint(const int &id) {
    ConstraintEnum type = static_cast<ConstraintEnum>(id / (SIZE * SIZE));
    int key1 = (id / SIZE) % SIZE;
    int key2 = id % SIZE;
    return Constraint{type, key1, key2};
  }
};

/**
 * @brief 数独のあるマスにある数字を入れるという選択肢を表す型
 */
struct Option {
  int row;     // マスの行
  int column;  // マスの列
  int number;  // マスに入る数字

  auto operator<=>(const Option &) const = default;

  // Optionを一意のidに変換する
  static int getId(const Option &option) {
    return option.row * SIZE * SIZE + option.column * SIZE + option.number;
  }

  // idをOptionに変換する
  static Option getOption(const int &id) {
    int row = id / (SIZE * SIZE);
    int column = (id / SIZE) % SIZE;
    int number = id % SIZE;
    return Option{row, column, number};
  }
};

/**
 * 行列被覆問題として見たときの各行の数独の制約の数
 * - 各マス(i, j)に何か数字が入ること (9 x 9 通り)
 * - 各行iに数字vが入ること (9 x 9 通り)
 * - 各列jに数字vが入ること (9 x 9 通り)
 * - 各ブロック(i, j)に数字vが入ること (9 x 9 通り)
 */
constexpr static int EXACT_COVER_COL = SIZE * SIZE * static_cast<int>(ConstraintEnum::ENUM_COUNT);

/**
 * 行列被覆問題として見たときの数独の選択肢の数
 * - 各マス(i, j)に数字vを入れる (9 x 9 x 9 通り)
 */
constexpr static int EXACT_COVER_ROW = SIZE * SIZE * SIZE;

/**
 * @brief 行列被覆問題の行列を表す型
 *
 * 1行につき4つまでしか要素を持たないので、圧縮した形で持つ
 */
using ExactCoverMatrix =
    std::array<std::array<Constraint, static_cast<int>(ConstraintEnum::ENUM_COUNT)>,
               EXACT_COVER_ROW>;
}  // namespace Sudoku
