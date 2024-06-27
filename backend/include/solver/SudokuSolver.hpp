#pragma once

#include <vector>

#include "solver/ColumnNode.hpp"
#include "solver/DancingNode.hpp"
#include "solver/HeaderNode.hpp"
#include "solver/RowNode.hpp"
#include "solver/SudokuType.hpp"

namespace Sudoku {
/**
 * @brief 数独の盤面を解く、一番メインの関数
 *
 * @param board 数独の盤面
 * @param solution 解のリスト
 * @param num_solutions 解の数
 * @param is_exact_num_solutions 解の数が正確かどうか
 * @param just_solution 解の数が要らない場合はtrue
 * @param max_num_solutions 探索する解の数の上限
 */
void solve(const Board& board, Board& solution, int& num_solutions, bool& is_exact_num_solutions,
           const bool just_solution = false, const int max_num_solutions = MAX_NUM_SOLUTIONS);
}  // namespace Sudoku
