#include "solver/ColumnNode.hpp"

#include "solver/IDancingLinksBodyNode.hpp"

namespace DancingLinks {
ColumnNode::ColumnNode() noexcept : IDancingLinksBodyNode(), size(0) {}

void ColumnNode::unlinkLR() const noexcept {
  this->left->right = this->right;
  this->right->left = this->left;
  return;
}

void ColumnNode::relinkLR() noexcept {
  this->left->right = this->right->left = this;
  return;
}
}  // namespace DancingLinks
