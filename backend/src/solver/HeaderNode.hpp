#pragma once

#include <limits>

#include "ColumnNode.hpp"


namespace DancingLinks {
    /** @brief 行列被覆問題のヘッダー
     * 
     * 現在の行列被覆問題に残っている列を管理する
     * このヘッダーに繋がるノードがないとき、制約を満たす選択肢が見つかったことを意味する
    */
    class HeaderNode : public ColumnNode {
    public:
        HeaderNode() : ColumnNode() {}

        /**
         * @brief このヘッダーが表す行列被覆問題が空かどうか判定する
         * @return true 空
         */
        bool isEmpty() const {
            return this->right == this;
        }

        /**
         * @brief 残っている行数が最も少ない列を選択する
         * @return 選択された列
         */
        ColumnNode* selectMinSizeColumn() const {
            ColumnNode* ret = nullptr;
            int minSize = std::numeric_limits<int>::max();
            for (DancingNode* i = this->right; i != this && minSize > 0; i = i->right) {
                ColumnNode* column_node = static_cast<ColumnNode*>(i);
                if (column_node->size < minSize) {
                    minSize = column_node->size;
                    ret = column_node;
                }
            }
            return ret;
        }
    }; // class HeaderNode
} // namespace DancingLinks