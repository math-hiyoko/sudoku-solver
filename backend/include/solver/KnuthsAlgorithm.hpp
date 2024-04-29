#pragma once

#include <vector>

#include "solver/HeaderNode.hpp"
#include "solver/RowNode.hpp"

namespace DancingLinks {
/**
 * @brief 行列被覆問題を解く関数
 *
 * 行列被覆問題はKnuthsAlgorithmというアルゴリズムで解くことができる
 * 制約を満たせる行が最も少ない列を選び、その列に対する選択肢を決め打ちして探索する
 *
 * @param header 行列被覆問題のヘッダー
 * @param solution 解を表すリストを格納
 * @param num_solutions 解の数
 * @param is_exact_num_solutions 解の数が正確かどうかを返す
 * @param just_solution 解の数が要らない場合はtrue
 * @param max_num_solutions 探索する解の数の上限
 */
void knuths_algorithm(HeaderNode *header, std::vector<RowNode *> &solution, int &num_solutios,
                      bool &is_exact_num_solutions, const bool just_solution,
                      const int max_num_solutions);
}  // namespace DancingLinks
