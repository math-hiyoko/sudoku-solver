#pragma once

#include <cassert>

#include "solver/DancingNode.hpp"

namespace DancingLinks {
/**
 * @brief 行列被覆問題の行を表すノード
 */
class RowNode {
 public:
  int option_id;  // この行が表す選択肢の番号

  RowNode(int option_id);
};  // class RowNode
}  // namespace DancingLinks
