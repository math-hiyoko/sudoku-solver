#pragma once

#include "solver/ColumnNode.hpp"

namespace DancingLinks {
/** @brief 行列被覆問題のヘッダー
 *
 * 現在の行列被覆問題に残っている列を管理する
 * このヘッダーに繋がるノードがないとき、制約を満たす選択肢が見つかったことを意味する
 */
class HeaderNode : public ColumnNode {
 public:
  HeaderNode();

  /**
   * @brief このヘッダーが表す行列被覆問題が空かどうか判定する
   * @return true 空
   */
  bool isEmpty() const;

  /**
   * @brief 残っている行数が最も少ない列を選択する
   * @return 選択された列
   */
  ColumnNode* selectMinSizeColumn() const;
};  // class HeaderNode
}  // namespace DancingLinks
