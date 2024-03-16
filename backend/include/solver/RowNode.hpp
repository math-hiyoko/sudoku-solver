#pragma once

#include <cassert>

#include "solver/DancingNode.hpp"

namespace DancingLinks {
/**
 * @brief 行列被覆問題の行を表すノード
 */
class RowNode {
 public:
  int option_id;       // この行が表す選択肢の番号
  DancingNode* front;  // この行の先頭のノード

  RowNode(int option_id);

  /**
   * @brief この選択を選択した時の行列の状態を覆って使えなくする
   */
  void cover();

  /**
   * @brief coverを元に戻す、coverした順の逆順に呼び出す
   */
  void uncover();
};  // class RowNode
}  // namespace DancingLinks
