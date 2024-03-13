#pragma once

#include <cassert>

#include "DancingNode.hpp"


namespace DancingLinks {
    /**
     * @brief 行列被覆問題の行を表すノード
     */
    class RowNode {
    public:
        int option_id;  // この行が表す選択肢の番号
        DancingNode* front;  // この行の先頭のノード
        
        RowNode(int option_id) : option_id(option_id), front(nullptr) {}

        /**
         * @brief この選択を選択した時の行列の状態を覆って使えなくする
         */
        void cover() {
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
            } while(i = i->right, i != this->front);

            return;
        }

        /**
         * @brief coverを元に戻す、coverした順の逆順で行う
         */
        void uncover() {
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
            } while(i = i->left, i != this->front->left);

            return;
        }
    }; // class RowNode
} // namespace DancingLinks
