#include "solver/RowNode.hpp"

#include "solver/ColumnNode.hpp"
#include "solver/DancingNode.hpp"

namespace DancingLinks {
RowNode::RowNode(const int option_id) noexcept : option_id(option_id) {}
}  // namespace DancingLinks