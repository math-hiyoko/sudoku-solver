#pragma once

#include "IDancingLinksBodyNode.hpp"

namespace DancingLinks {
class ColumnNode;
class RowNode;

/**
 * @brief 行列被覆問題における行列のある要素を表すクラス
 *
 * このクラスは、行列の各ノードを表す。
 * 各ノードは、行の選択肢が列の制約を満たすことを表す。
 * 具体的には、行がマスと数字の組み合わせ、列がそのマスと数字の組み合わせによって満たされるブロックと行と列の制約を表す。
 */
class DancingNode : public IDancingLinksBodyNode {
 private:
  ColumnNode* const column;  // このノードが属する列
  DancingNode* left;         // 左にリンクするノード
  DancingNode* right;        // 右にリンクするノード

  /**
   * @brief このノードを列のリンクから外す
   */
  void unlinkUD();

  /**
   * @brief このノードを列のリンクに戻す
   */
  void relinkUD();

 public:
  RowNode* const row;  // このノードが属する行

  DancingNode(RowNode* const row, ColumnNode* const column);

  /**
   * @brief 現在のノードの左にnodeを相互リンクする
   * @param node リンク相手のnode
   * @return 連結後のnode
   */
  DancingNode* hookLeft(DancingNode* node);

  /**
   * @brief この選択を選択した時の行列の状態を覆って使えなくする
   */
  void cover();

  /**
   * @brief coverを元に戻す、coverした順の逆順に呼び出す
   */
  void uncover();
};  // class DancingNode
}  // namespace DancingLinks
