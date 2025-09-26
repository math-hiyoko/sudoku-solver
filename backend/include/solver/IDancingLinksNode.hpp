#pragma once

namespace DancingLinks {
/**
 * @brief 行列被覆問題のノード用のインターフェース
 */
class IDancingLinksNode {
 public:
  IDancingLinksNode* left;   // 左にリンクするノード
  IDancingLinksNode* right;  // 右にリンクするノード

  IDancingLinksNode() noexcept;

  virtual ~IDancingLinksNode() noexcept = default;

  /**
   * @brief 現在のノードの左にnodeを相互リンクする
   * @param node リンク相手のnode
   * @return 連結後のnode
   */
  IDancingLinksNode* hookLeft(IDancingLinksNode* node);
};  // class IDancingLinksNode
}  // namespace DancingLinks
