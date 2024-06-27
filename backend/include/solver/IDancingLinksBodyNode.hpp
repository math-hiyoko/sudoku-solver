#pragma once

#include "IDancingLinksNode.hpp"

namespace DancingLinks {
/**
 * @brief ColumnかNodeを表すクラス
 */
class IDancingLinksBodyNode : public IDancingLinksNode {
 public:
  IDancingLinksBodyNode* up;    // 上にリンクするノード
  IDancingLinksBodyNode* down;  // 下にリンクするノード

  IDancingLinksBodyNode();

  virtual ~IDancingLinksBodyNode() = default;

  /**
   * @brief 現在のノードの上にnodeを相互リンクする
   * @param node リンク相手のnode
   * @return 連結後のnode
   */
  IDancingLinksBodyNode* hookUp(IDancingLinksBodyNode* node);
};  // class IDancingLinksBodyNode
}  // namespace DancingLinks
