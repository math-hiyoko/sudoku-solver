#pragma once

#include <boost/pool/object_pool.hpp>
#include <vector>

#include "solver/ColumnNode.hpp"
#include "solver/IDancingLinksNode.hpp"
#include "solver/RowNode.hpp"

namespace DancingLinks {
/** @brief 行列被覆問題のヘッダー
 *
 * 現在の行列被覆問題に残っている列を管理する
 * このヘッダーに繋がるノードがないとき、制約を満たす選択肢が見つかったことを意味する
 */
class HeaderNode : public IDancingLinksNode {
 private:
  /**
   * @brief このヘッダーが表す行列被覆問題が空かどうか判定する
   * @return true 空
   */
  bool isEmpty() const;

  /**
   * @brief 残っている行数が最も少ない列を選択する
   * @return 選択された列
   */
  ColumnNode *selectMinSizeColumn() const;

  /**
   * @brief このheaderと同じ構造を持つHeaderNodeを複製する
   */
  HeaderNode *clone(boost::object_pool<DancingLinks::DancingNode> &dancing_node_pool,
                    boost::object_pool<DancingLinks::ColumnNode> &column_node_pool,
                    boost::object_pool<DancingLinks::HeaderNode> &header_node_pool) const;

 public:
  HeaderNode();

  /**
   * @brief 行列被覆問題を解く関数
   *
   * 行列被覆問題はKnuthsAlgorithmというアルゴリズムで解くことができる
   * 制約を満たせる行が最も少ない列を選び、その列に対する選択肢を決め打ちして探索する
   *
   * @param solution 解を表すリストを格納
   * @param num_solutions 解の数
   * @param is_exact_num_solutions 解の数が正確かどうかを返す
   * @param just_solution 解の数が要らない場合はtrue
   * @param max_num_solutions 探索する解の数の上限
   */
  void solve(std::vector<RowNode *> &solution, int &num_solutios,
                        bool &is_exact_num_solutions, const bool &just_solution,
                        const int &max_num_solutions);
};  // class HeaderNode
}  // namespace DancingLinks
