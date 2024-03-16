#include "solver/ColumnNode.hpp"

#include <cassert>

#include "solver/DancingNode.hpp"

namespace DancingLinks {
ColumnNode::ColumnNode() : DancingNode(nullptr, nullptr), size(0) {}

ColumnNode* ColumnNode::hookRight(ColumnNode* node) {
  assert(node != nullptr);
  node->right = this->right;
  node->right->left = node;
  node->left = this;
  this->right = node;
  return node;
}

void ColumnNode::unlinkLR() {
  this->left->right = this->right;
  this->right->left = this->left;
  return;
}

void ColumnNode::relinkLR() {
  this->left->right = this;
  this->right->left = this;
}

bool ColumnNode::isSatisfiable() const { return this->size != 0; }
}  // namespace DancingLinks
