#include "solver/DancingNode.hpp"

#include <cassert>

#include "solver/ColumnNode.hpp"

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

DancingNode* DancingNode::hookUp(DancingNode* node) {
  assert(node != nullptr);
  this->up->hookDown(node);
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

DancingNode* DancingNode::hookLeft(DancingNode* node) {
  assert(node != nullptr);
  this->left->hookRight(node);
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

void DancingNode::cover() {
  // この行が満たす選択肢について走査
  DancingNode* i = this;
  do {
    for (DancingNode* j = i->down; j != i; j = j->down) {
      if (j == i->column) {
        // この選択肢を満たす行を覆う
        static_cast<ColumnNode*>(j)->unlinkLR();
        continue;
      }
      // 今見ている列(i->column)を満たす行を覆う
      for (DancingNode* k = j->right; k != j; k = k->right) {
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
    for (DancingNode* j = i->up; j != i; j = j->up) {
      if (j == i->column) {
        // この選択肢を満たす行を元に戻す
        static_cast<ColumnNode*>(j)->relinkLR();
        continue;
      }
      // 今見ている列(i->column)を満たす行を元に戻す
      for (DancingNode* k = j->left; k != j; k = k->left) {
        k->column->size++;
        k->relinkUD();
      }
    }
  } while (i = i->left, i != this->left);

  return;
}
}  // namespace DancingLinks
