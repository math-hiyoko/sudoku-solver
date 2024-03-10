#pragma once

#include <array>


/**
 * 数独の問題としての次元、3なら9x9の数独、4なら16x16の数独
 * ここの数字を変えるだけで、任意の次元の数独に対応できるように作っている
 */
constexpr static int SUDOKU_DIM = 3;

/**
 * 数独の一辺のマスの数
*/
constexpr static int SUDOKU_SIZE = SUDOKU_DIM * SUDOKU_DIM;

/**
 * @brief 数独の盤面を表す型
 */
using SudokuBoard = std::array<std::array<int, SUDOKU_SIZE>, SUDOKU_SIZE>;

/**
 * @brief 数独の制約の種類を表す型
 */
enum class ConstraintEnum {
    OCCUPIED,  // マス(i, j)に何か数字が入ること
    ROW,       // 行
    COLUMN,    // 列
    BLOCK      // ブロック
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

    // ConstraintTypeを一意のidに変換する
    static int getId(const Constraint &constraint) {
        return static_cast<int>(constraint.type) * SUDOKU_SIZE * SUDOKU_SIZE + constraint.key1 * SUDOKU_SIZE + constraint.key2;
    }

    // idをConstraintTypeに変換する
    static Constraint getConstraint(const int &id) {
        ConstraintEnum type = static_cast<ConstraintEnum>(id / (SUDOKU_SIZE * SUDOKU_SIZE));
        int key1 = (id / SUDOKU_SIZE) % SUDOKU_SIZE;
        int key2 = id % SUDOKU_SIZE;
        return Constraint{type, key1, key2};
    }
};

/**
 * 行列被覆問題として見たときの各行の数独の制約の数
 * - 各マス(i, j)に何か数字が入ること (9 x 9 通り)
 * - 各行iに数字vが入ること (9 x 9 通り)
 * - 各列jに数字vが入ること (9 x 9 通り)
 * - 各ブロック(i, j)に数字vが入ること (9 x 9 通り)
 */
constexpr static int EXACT_COVER_COL = 4 * SUDOKU_SIZE * SUDOKU_SIZE;

/**
 * 行列被覆問題として見たときの数独の選択肢の数
 * - 各マス(i, j)に数字vを入れる (9 x 9 x 9 通り)
 */
constexpr static int EXACT_COVER_ROW = SUDOKU_SIZE * SUDOKU_SIZE * SUDOKU_SIZE;

/**
 * @brief 行列被覆問題の行列を表す型
 */
using ExactCoverMatrix = std::array<std::array<bool, EXACT_COVER_COL>, EXACT_COVER_ROW>;
