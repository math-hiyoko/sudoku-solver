#include "solver/IDancingLinksBodyNode.hpp"

#include <cassert>

#include "solver/IDancingLinksNode.hpp"

namespace DancingLinks {
IDancingLinksBodyNode::IDancingLinksBodyNode() : IDancingLinksNode(), up(this), down(this) {}
IDancingLinksBodyNode* IDancingLinksBodyNode::hookUp(IDancingLinksBodyNode* node) {
  assert(node != nullptr);
  node->up = this->up;
  node->down = this;
  this->up->down = node;
  this->up = node;
  return node;
}
}  // namespace DancingLinks
