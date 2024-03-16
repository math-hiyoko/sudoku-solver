#include "solver/RowNode.hpp"

#include <cassert>

#include "solver/ColumnNode.hpp"
#include "solver/DancingNode.hpp"

namespace DancingLinks {
RowNode::RowNode(int option_id) : option_id(option_id), front(nullptr) {}

void RowNode::cover() {
  // この行が満たす選択肢について走査
  DancingNode* i = this->front;
  do {
    // この選択肢を満たす行を覆う
    i->column->unlinkLR();
    for (DancingNode* j = i->down; j != i; j = j->down) {
      if (j == i->column) {
        continue;
      }
      // 今見ている列(i->column)を満たす行を覆う
      for (DancingNode* k = j->right; k != j; k = k->right) {
        // columnのfrontはcoverされていないものを参照できるようにする
        k->unlinkUD();
        k->column->size--;
      }
    }
  } while (i = i->right, i != this->front);

  return;
}

void RowNode::uncover() {
  // この行が満たす選択肢について走査
  DancingNode* i = this->front->left;
  do {
    // この選択肢を満たす行を元に戻す
    i->column->relinkLR();
    for (DancingNode* j = i->up; j != i; j = j->up) {
      if (j == i->column) {
        continue;
      }
      // 今見ている列(i->column)を満たす行を元に戻す
      for (DancingNode* k = j->left; k != j; k = k->left) {
        k->column->size++;
        k->relinkUD();
      }
    }
  } while (i = i->left, i != this->front->left);

  return;
}
}  // namespace DancingLinks