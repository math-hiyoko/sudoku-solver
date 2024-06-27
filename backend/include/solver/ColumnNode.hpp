#pragma once

#include <vector>

#include "solver/IDancingLinksBodyNode.hpp"

namespace DancingLinks {
/**
 * @brief 行列被覆問題の列を表すノード
 */
class ColumnNode : public IDancingLinksBodyNode {
 public:
  ColumnNode();

  int size;  // この列に含まれる(覆われていない)ノードの数

  /**
   * @brief この列をheaderの繋がりから外す
   */
  void unlinkLR();

  /**
   * @brief この列をheaderの繋がりに戻す
   */
  void relinkLR();
};  // class ColumnNode
}  // namespace DancingLinks
