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
 * @param num_answer 解の数
 * @param answer 解を格納するリスト
 * @param just_answer 解の数が要らない場合はtrue
 */
void knuths_algorithm(HeaderNode *header, std::vector<RowNode *> &answer, int &num_answer,
                      bool &is_exact_num_answer, const bool just_answer, const int max_num_answer);
}  // namespace DancingLinks
