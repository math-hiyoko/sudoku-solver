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
enum class SudokuConstraintEnum {
    OCCUPIED,  // マス(i, j)に何か数字が入ること
    ROW,       // 行
    COLUMN,    // 列
    BLOCK,     // ブロック
    ENUM_COUNT // 要素数を取得するのに使う
};

/**
 * @brief 数独の制約を表す型
 */
struct SudokuConstraint {
    SudokuConstraintEnum type;  // 制約の種類
    /**
     * - 制約の種類が OCCUPIED の場合、マス(key1, key2)に数字がはいること
     * - 制約の種類が ROW の場合、行key1に数字key2がはいること
     * - 制約の種類が COLUMN の場合、列key1に数字key2がはいること
     * - 制約の種類が BLOCK の場合、ブロックkey1に数字key2がはいること
    */
    int key1;
    int key2;

    // SudokuConstraintTypeを一意のidに変換する
    static int getId(const SudokuConstraint &constraint) {
        return static_cast<int>(constraint.type) * SUDOKU_SIZE * SUDOKU_SIZE + constraint.key1 * SUDOKU_SIZE + constraint.key2;
    }

    // idをSudokuConstraintTypeに変換する
    static SudokuConstraint getSudokuConstraint(const int &id) {
        SudokuConstraintEnum type = static_cast<SudokuConstraintEnum>(id / (SUDOKU_SIZE * SUDOKU_SIZE));
        int key1 = (id / SUDOKU_SIZE) % SUDOKU_SIZE;
        int key2 = id % SUDOKU_SIZE;
        return SudokuConstraint{type, key1, key2};
    }
};

/**
 * @brief 数独のあるマスにある数字を入れるという選択肢を表す型
*/
struct SudokuOption {
    int row;    // マスの行
    int column; // マスの列
    int number; // マスに入る数字

    // SudokuOptionを一意のidに変換する
    static int getId(const SudokuOption &option) {
        return option.row * SUDOKU_SIZE * SUDOKU_SIZE + option.column * SUDOKU_SIZE + option.number;
    }

    // idをSudokuOptionに変換する
    static SudokuOption getSudokuOption(const int &id) {
        int row = id / (SUDOKU_SIZE * SUDOKU_SIZE);
        int column = (id / SUDOKU_SIZE) % SUDOKU_SIZE;
        int number = id % SUDOKU_SIZE;
        return SudokuOption{row, column, number};
    }
};

/**
 * 行列被覆問題として見たときの各行の数独の制約の数
 * - 各マス(i, j)に何か数字が入ること (9 x 9 通り)
 * - 各行iに数字vが入ること (9 x 9 通り)
 * - 各列jに数字vが入ること (9 x 9 通り)
 * - 各ブロック(i, j)に数字vが入ること (9 x 9 通り)
 */
constexpr static int EXACT_COVER_COL = SUDOKU_SIZE * SUDOKU_SIZE * static_cast<int>(SudokuConstraintEnum::ENUM_COUNT);

/**
 * 行列被覆問題として見たときの数独の選択肢の数
 * - 各マス(i, j)に数字vを入れる (9 x 9 x 9 通り)
 */
constexpr static int EXACT_COVER_ROW = SUDOKU_SIZE * SUDOKU_SIZE * SUDOKU_SIZE;

/**
 * @brief 行列被覆問題の行列を表す型
 * 
 * 1行につき4つまでしか要素を持たないので、圧縮した形で持つ
 */
using ExactCoverMatrix = std::array<std::array<SudokuConstraint, static_cast<int>(SudokuConstraintEnum::ENUM_COUNT)>, EXACT_COVER_ROW>;
