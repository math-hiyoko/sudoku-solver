#pragma once

#include <cassert>

#include "solver/DancingNode.hpp"

namespace DancingLinks {
/**
 * @brief 行列被覆問題の行を表すノード
 */
class RowNode {
 public:
  const int option_id;  // この行が表す選択肢の番号

  RowNode(const int option_id);
};  // class RowNode
}  // namespace DancingLinks
