#pragma once

#include <vector>

#include "solver/SudokuType.hpp"

namespace Sudoku {
/**
 * @brief 数独の盤面中の数字が正常か判定する
 *
 * @param board 数独の盤面
 * @param constraints 入力した盤面が満たさなかった制約
 * @return 正常なら0, そうでなければ0以外
 */
int isValidRange(const Board& board, std::vector<Option>& options);

/**
 * @brief 現在の盤面が数独の制約を満たすか判定する
 *
 * @param board 数独の盤面
 * @param constraints 入力した盤面が満たさなかった制約
 * @return 製薬を満たす場合は0, そうでなければ0以外
 */
int isSatisfy(const Board& board, std::vector<Constraint>& constraints);
}  // namespace Sudoku
