#pragma once


/**
 * @brief 数独問題の現在の状態を表すためのデータ構造
 * 
 * Dancing Linksは、行列の被覆問題を解くためのアルゴリズム。
 * 各列が制約を表し、各行が制約を満たすための選択肢を表す。
 * 全ての列を満遍なく覆うことができる行の組み合わせを見つけることで、制約を満たす選択肢を見つけることができる。
*/
class DancingLinks {
 private:
    /** @brief Dancing Linksのヘッダー
     * 
     * すべての列を繋ぐためのヘッダー、このヘッダーに繋がるノードがない時、制約を満たす選択肢が見つかったことを意味する
    */
    ColumnNode* header;

    /**
     * @brief Dancing Linksの各ノードを表すクラス、ノードの行の選択肢が列の制約を満たすことを表す
    */
    class DancingNode {
      public:
        DancingNode* left;
        DancingNode* right;
        DancingNode* up;
        DancingNode* down;
        ColumnNode* column;

        DancingNode();

        /// @brief 現在のノードの下にnodeを相互リンクする
        /// @param node 
        /// @return 連結後のnode
        DancingNode* hookDown(DancingNode* node);

        /// @brief 現在のノードの右にnodeを相互リンクする
        /// @param node 
        /// @return 連結後のnode
        DancingNode* hookRight(DancingNode* node);

        /// @brief このノードを行のリンクから外す
        void unlinkLR();

        /// @brief このノードを行のリンクに戻す
        void relinkLR();

        /// @brief このノードを列のリンクから外す
        void unlinkUD();

        /// @brief このノードを列のリンクに戻す
        void relinkUD();
    };

    /**
     * @brief Dancing Linksの列を表すノード
     */
    class ColumnNode : public DancingNode {
      private:
        /// @brief この列に含まれるノードの数
        int size;
        int id;

      public:
        ColumnNode(int id);

        /// @brief このノードから辿れるノードを全て覆う
        void cover();

        /// @brief このノードから辿れるノードを全て戻す
        void uncover();
    };
};
