#pragma once

#include "solver/IDancingLinksBodyNode.hpp"

namespace DancingLinks {
/**
 * @brief 行列被覆問題の列を表すノード
 */
class ColumnNode : public IDancingLinksBodyNode {
 public:
  ColumnNode() noexcept;

  int size;  // この列に含まれる(覆われていない)ノードの数

  /**
   * @brief この列をheaderの繋がりから外す
   */
  void unlinkLR() const noexcept;

  /**
   * @brief この列をheaderの繋がりに戻す
   */
  void relinkLR() noexcept;
};  // class ColumnNode
}  // namespace DancingLinks
