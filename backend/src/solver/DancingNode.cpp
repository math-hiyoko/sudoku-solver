#include "solver/DancingNode.hpp"

#include <cassert>

namespace DancingLinks {
DancingNode::DancingNode(RowNode* row, ColumnNode* column)
    : left(this), right(this), up(this), down(this), row(row), column(column) {}

DancingNode* DancingNode::hookDown(DancingNode* node) {
  assert(node != nullptr);
  node->down = this->down;
  node->down->up = node;
  node->up = this;
  this->down = node;
  return node;
}

DancingNode* DancingNode::hookRight(DancingNode* node) {
  assert(node != nullptr);
  node->right = this->right;
  node->right->left = node;
  node->left = this;
  this->right = node;
  return node;
}

void DancingNode::unlinkUD() {
  this->up->down = this->down;
  this->down->up = this->up;
  return;
}

void DancingNode::relinkUD() {
  this->up->down = this;
  this->down->up = this;
  return;
}
}  // namespace DancingLinks
