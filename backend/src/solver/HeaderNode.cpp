#include "solver/HeaderNode.hpp"

#include <cassert>
#include <limits>

#include "solver/ColumnNode.hpp"

namespace DancingLinks {
HeaderNode::HeaderNode() : ColumnNode() {}

bool HeaderNode::isEmpty() const { return this->right == this; }

ColumnNode* HeaderNode::selectMinSizeColumn() const {
  ColumnNode* ret = nullptr;
  int minSize = std::numeric_limits<int>::max();
  for (DancingNode* i = this->right; i != this && minSize > 0; i = i->right) {
    ColumnNode* column_node = static_cast<ColumnNode*>(i);
    if (column_node->size < minSize) {
      minSize = column_node->size;
      ret = column_node;
    }
  }
  return ret;
}
}  // namespace DancingLinks
