#pragma once

#include <limits>

#include "ColumnNode.hpp"
#include "DancingNode.hpp"


/** @brief 行列被覆問題のヘッダー
 * 
 * 現在の行列被覆問題に残っている列を管理する
 * このヘッダーに繋がるノードがないとき、制約を満たす選択肢が見つかったことを意味する
*/
class HeaderNode : public DancingNode {
 public:
    HeaderNode() : DancingNode() {}

    /// @brief このヘッダーが表す行列被覆問題が空かどうか判定する
    bool isEmpty() {
        return this->right == this;
    }

    /// @brief 残っている行数が最も少ない列を選択する
    ColumnNode* selectMinSizeColumn() {
        ColumnNode* ret = nullptr;
        int minSize = std::numeric_limits<int>::max();
        for (DancingNode* i = this->right; i != this && minSize > 0; i = i->right) {
            ColumnNode* column = static_cast<ColumnNode*>(i);
            if (column->size < minSize) {
                minSize = column->size;
                ret = column;
            }
        }
        return ret;
    }
};
