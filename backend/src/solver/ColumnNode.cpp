#include "solver/ColumnNode.hpp"

#include <cassert>
#include <vector>

#include "solver/IDancingLinksBodyNode.hpp"

namespace DancingLinks {
ColumnNode::ColumnNode() : IDancingLinksBodyNode(), size(0) {}

void ColumnNode::unlinkLR() {
  this->left->right = this->right;
  this->right->left = this->left;
  return;
}

void ColumnNode::relinkLR() { this->left->right = this->right->left = this; }
}  // namespace DancingLinks
