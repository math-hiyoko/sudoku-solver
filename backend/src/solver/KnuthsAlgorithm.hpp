#pragma once

#include <cassert>

#include <stack>
#include <vector>

#include "ColumnNode.hpp"
#include "HeaderNode.hpp"
#include "RowNode.hpp"
#include "SudokuType.hpp"


namespace DancingLinks {
    /**
     * @brief 行列被覆問題を解く関数
     * 
     * 行列被覆問題はKnuthsAlgorithmというアルゴリズムで解くことができる
     * 制約を満たせる行が最も少ない列を選び、その列に対する選択肢を決め打ちして探索する
     * 
     * @param header 行列被覆問題のヘッダー
     * @param num_answer 解の数
     * @param answer 解を格納するリスト
     * @param just_answer 解の数が要らない場合はtrue
     */
    void knuths_algorithm(
        HeaderNode *header,
        std::vector<RowNode*> &answer,
        int &num_answer,
        bool &is_exact_num_answer,
        bool just_answer = false,
        int MAX_NUM_ANSWER = Sudoku::MAX_NUM_ANSWER
    ) {
        // 探索中の状態を保存するための構造体
        struct NodeState {
            int index;      // answer_buf中の何番目の要素になるか
            RowNode *node;  // 選択した行
        };

        // 探索中の状態を保存するスタック
        std::stack<NodeState> search_stack;
        // 最初は最も少ない行数の列を選択する
        ColumnNode *column = header->selectMinSizeColumn();

        assert(column != nullptr);
        if (!column->isSatisfiable()) {
            num_answer = 0;
            return;
        }

        // この列の条件を満たす選択肢を全てスタックに積む
        for (DancingNode* i = column->down; i != column; i = i->down) {
            search_stack.push({0, i->row});
        }

        // 解の候補を保存するためのバッファ
        std::vector<RowNode*> answer_buf;

        while (!search_stack.empty()) {
            NodeState state = search_stack.top();
            search_stack.pop();

            // stateをindex番目の要素にするために、indexより後ろの要素の反映を元に戻す
            // converした順に戻さないといけない
            for (int i = answer_buf.size() - 1; i >= state.index; i--) {
                // answer_buf[i]を選択したという設定を元に戻す
                answer_buf[i]->uncover();
            }
            answer_buf.resize(state.index);

            // state.nodeを選択したことにして反映を行う
            state.node->cover();
            answer_buf.push_back(state.node);

            if (header->isEmpty()) {
                // headerが空 => 解が見つかった
                assert(answer_buf.size() == Sudoku::SIZE * Sudoku::SIZE);
                num_answer++;
                if (answer.empty()) {
                    answer = answer_buf;
                }

                // state.nodeを選択したという設定を元に戻す
                state.node->uncover();
                answer_buf.pop_back();

                // 解が1つ欲しいだけの場合は探索を打ち切る
                if (just_answer || num_answer >= MAX_NUM_ANSWER) {
                    is_exact_num_answer = false;
                    return;
                }

                continue;
            }

            // 次の列を選択する
            ColumnNode *next_column = header->selectMinSizeColumn();
            for (DancingNode *i = next_column->down; i != next_column; i = i->down) {
                search_stack.push({state.index + 1, i->row});
            }
        }

        is_exact_num_answer = true;
        return;
    } // knuths_algorithm
} // namespace DancingLinks