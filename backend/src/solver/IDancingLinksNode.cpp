#include "solver/IDancingLinksNode.hpp"

#include <cassert>

namespace DancingLinks {
IDancingLinksNode::IDancingLinksNode() noexcept : left(this), right(this) {}

IDancingLinksNode* IDancingLinksNode::hookLeft(IDancingLinksNode* node) {
  assert(node != nullptr);
  node->right = this;
  node->left = this->left;
  this->left->right = node;
  this->left = node;
  return node;
}
}  // namespace DancingLinks
