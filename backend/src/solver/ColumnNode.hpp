#pragma once

#include <cassert>

#include "DancingNode.hpp"


/**
 * @brief 行列被覆問題の列を表すノード
 */
class ColumnNode : public DancingNode {
 public:
    int size;  // この列に含まれる(覆われていない)ノードの数
    
    ColumnNode() : DancingNode(), size(0) {}

    /**
     * @brief 現在の列の右にnodeを相互リンクする
     * @param node リンク相手のnode
     * @return 連結後のnode
     */
    ColumnNode* hookRight(ColumnNode* node) {
        assert(node != nullptr);
        node->right = this->right;
        node->right->left = node;
        node->left = this;
        this->right = node;
        return node;
    }

    /**
     * @brief この列をheaderの繋がりから外す
     */
    void unlinkLR() {
        this->left->right = this->right;
        this->right->left = this->left;
        return;
    }

    /**
     * @brief この列をheaderの繋がりに戻す
     */
    void relinkLR() {
        this->left->right = this;
        this->right->left = this;
        return;
    }

    /**
     * @brief この列の制約を満たすことができるかどうか
     */
    bool isSatisfiable() const {
        return size != 0;
    }
};
