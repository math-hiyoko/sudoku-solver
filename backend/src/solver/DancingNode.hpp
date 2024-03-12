#pragma once

#include <cassert>


class ColumnNode;
class RowNode;

/**
 * @brief 行列被覆問題における行列のある要素を表すクラス
 * 
 * このクラスは、行列の各ノードを表す。
 * 各ノードは、行の選択肢が列の制約を満たすことを表す。
 * 具体的には、行がマスと数字の組み合わせ、列がそのマスと数字の組み合わせによって満たされるブロックと行と列の制約を表す。
 */
class DancingNode {
 public:
    DancingNode* left;  // 左にリンクするノード
    DancingNode* right; // 右にリンクするノード
    DancingNode* up;    // 上にリンクするノード
    DancingNode* down;  // 下にリンクするノード
    RowNode* row;       // このノードが属する行
    ColumnNode* column; // このノードが属する列

    DancingNode() : left(this), right(this), up(this), down(this), row(nullptr), column(nullptr) {}

    DancingNode(RowNode* row, ColumnNode* column) : left(this), right(this), up(this), down(this), row(row), column(column) {}

    /**
     * @brief 現在のノードの下にnodeを相互リンクする
     * @param node リンク相手のnode
     * @return 連結後のnode
     */
    DancingNode* hookDown(DancingNode* node) {
        assert(node != nullptr);
        node->down = this->down;
        node->down->up = node;
        node->up = this;
        this->down = node;
        return node;
    }

    /**
     * @brief 現在のノードの右にnodeを相互リンクする
     * @param node リンク相手のnode
     * @return 連結後のnode
     */
    DancingNode* hookRight(DancingNode* node) {
        assert(node != nullptr);
        node->right = this->right;
        node->right->left = node;
        node->left = this;
        this->right = node;
        return node;
    }

    /**
     * @brief このノードを列のリンクから外す
     */
    void unlinkUD() {
        this->up->down = this->down;
        this->down->up = this->up;
        return;
    }

    /**
     * @brief このノードを列のリンクに戻す
     */
    void relinkUD() {
        this->up->down = this;
        this->down->up = this;
        return;
    }
};
