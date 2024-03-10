#pragma once

#include <cassert>

#include "DancingNode.hpp"
#include "SudokuSolver.hpp"
#include "SudokuType.hpp"


/**
 * @brief 行列被覆問題の列を表すノード
 */
class ColumnNode : public DancingNode {
 public:
    int size;  // この列に含まれる(覆われていない)ノードの数
    ConstraintType constraint;    // この列が表す制約
    
    ColumnNode(ConstraintType constraint) : DancingNode(), size(0), constraint(constraint) {}

    /// @brief このノードから辿れるDancingNodeを覆って使えなくする
    void cover() {
        this->unlinkLR();
        for (DancingNode* i = this->down; i != this; i = i->down) {
            for (DancingNode* j = i->right; j != i; j = j->right) {
                j->unlinkUD();
                j->column->size--;
            }
        }
        return;
    }

    /// @brief coverを元に戻す
    void uncover() {
        for (DancingNode* i = this->up; i != this; i = i->up) {
            for (DancingNode* j = i->left; j != i; j = j->left) {
                j->column->size++;
                j->relinkUD();
            }
        }
        this->relinkLR();
        return;
    }
};
