#pragma once

#include "solver/DancingNode.hpp"

namespace DancingLinks {
/**
 * @brief 行列被覆問題の列を表すノード
 */
class ColumnNode : public DancingNode {
 private:
  /**
   * @brief この列をheaderの繋がりから外す
   */
  void unlinkLR();

  /**
   * @brief この列をheaderの繋がりに戻す
   */
  void relinkLR();

  /**
   * @brief この列の制約を満たすことができるかどうか
   */
  bool isSatisfiable() const;

  friend class DancingNode;
  friend class HeaderNode;

 public:
  int size;  // この列に含まれる(覆われていない)ノードの数

  ColumnNode();

  /**
   * @brief 現在の列の右にnodeを相互リンクする
   * @param node リンク相手のnode
   * @return 連結後のnode
   */
  ColumnNode* hookRight(ColumnNode* node);
};  // class ColumnNode
}  // namespace DancingLinks
