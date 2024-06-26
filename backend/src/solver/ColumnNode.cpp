#include "solver/ColumnNode.hpp"

#include <cassert>
#include <vector>

#include "solver/DancingNode.hpp"

namespace DancingLinks {
ColumnNode::ColumnNode() : DancingNode(nullptr, this), size(0) {}

void ColumnNode::unlinkLR() {
  this->left->right = this->right;
  this->right->left = this->left;
  return;
}

void ColumnNode::relinkLR() { this->left->right = this->right->left = this; }
}  // namespace DancingLinks
