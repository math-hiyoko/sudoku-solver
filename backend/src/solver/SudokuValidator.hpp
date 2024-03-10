#pragma once

#include <vector>

#include "SudokuType.hpp"


/**
 * @brief 現在の盤面が数独の制約を満たすか判定する
 * 
 * @param board 数独の盤面
 * @param constraints 入力した盤面が満たさなかった制約
 * @return 0 制約を満たす
 * @return 0以外 制約を満たさない
 */
int isSatisfy(const SudokuBoard& board, std::vector<ConstraintType>& constraints);
