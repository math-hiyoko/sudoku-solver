#include "solver/DancingNode.hpp"

#include <cassert>

#include "solver/ColumnNode.hpp"
#include "solver/IDancingLinksBodyNode.hpp"

namespace DancingLinks {
DancingNode::DancingNode(RowNode* const row, ColumnNode* const column)
    : IDancingLinksBodyNode(), left(this), right(this), row(row), column(column) {}

void DancingNode::unlinkUD() {
  this->up->down = this->down;
  this->down->up = this->up;
  return;
}

void DancingNode::relinkUD() {
  this->up->down = this->down->up = this;
  return;
}

DancingNode* DancingNode::hookLeft(DancingNode* node) {
  assert(node != nullptr);
  node->right = this;
  node->left = this->left;
  this->left->right = node;
  this->left = node;
  return node;
}

void DancingNode::cover() {
  // この行が満たす選択肢について走査
  DancingNode* i = this;
  do {
    for (IDancingLinksBodyNode* j = i->down; j != i; j = j->down) {
      if (j == i->column) {
        // この選択肢を満たす行を覆う
        static_cast<ColumnNode*>(j)->unlinkLR();
        continue;
      }
      // 今見ている列(i->column)を満たす行を覆う
      for (DancingNode* k = static_cast<DancingNode*>(j)->right; k != j; k = k->right) {
        k->unlinkUD();
        k->column->size--;
      }
    }
  } while (i = i->right, i != this);

  return;
}

void DancingNode::uncover() {
  // この行が満たす選択肢について走査、coverした順の逆順に戻さなければいけない
  DancingNode* i = this->left;
  do {
    for (IDancingLinksBodyNode* j = i->up; j != i; j = j->up) {
      if (j == i->column) {
        // この選択肢を満たす行を元に戻す
        static_cast<ColumnNode*>(j)->relinkLR();
        continue;
      }
      // 今見ている列(i->column)を満たす行を元に戻す
      for (DancingNode* k = static_cast<DancingNode*>(j)->left; k != j; k = k->left) {
        k->column->size++;
        k->relinkUD();
      }
    }
  } while (i = i->left, i != this->left);

  return;
}
}  // namespace DancingLinks
