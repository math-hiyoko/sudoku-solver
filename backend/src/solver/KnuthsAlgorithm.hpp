#pragma once

#include <cassert>

#include <memory>
#include <stack>
#include <vector>

#include "ColumnNode.hpp"
#include "HeaderNode.hpp"
#include "SudokuType.hpp"


/**
 * @brief 行列被覆問題を解く関数
 * 
 * 行列被覆問題はKnuthsAlgorithmというアルゴリズムで解くことができる
 * 制約を満たせる行が最も少ない列を選び、その列に対する選択肢を決め打ちして探索する
 * 
 * @param header 行列被覆問題のヘッダー
 * @param num_answer 解の数
 * @param answer 解のリスト
 * @param just_answer 解の数が要らない場合はtrue
 */
void knuths_algorithm(
    HeaderNode *header,
    int &num_answer,
    std::vector<DancingNode*> &answer,
    bool just_answer = false
) {
    // 解の候補を保存するためのバッファ
    std::vector<DancingNode*> answer_buf;

    // 探索中の状態を保存するための構造体
    struct NodeState {
        int index;         // answer_buf中の何番目の要素になるか
        DancingNode *node; // 選択したノード
    };

    // 探索中の状態を保存するスタック
    std::stack<NodeState> search_stack;
    // 最初は最も少ない行数の列を選択する
    ColumnNode *column = header->selectMinSizeColumn();

    assert(column != nullptr);
    // この列を満たす選択肢がない場合は解が存在しない
    if (column->down == column) {
        num_answer = 0;
        return;
    }

    // この列の条件を満たすことを考える
    column->cover();
    for (DancingNode *i = column->down; i != column; i = i->down) {
        search_stack.push({0, i});
    }

    while (!search_stack.empty()) {
        NodeState state = search_stack.top();
        search_stack.pop();
        // stateをindex番目の要素にするために、indexより後ろの要素を削除する
        while (answer_buf.size() > state.index) {
            // answer_buf.back()を選択したという設定を元に戻す
            for (DancingNode *j = answer_buf.back()->left; j != answer_buf.back(); j = j->left) {
                j->column->uncover();
            }
            answer_buf.back()->column->uncover();
            answer_buf.pop_back();
        }

        // state.nodeを選択したことにして反映を行う
        answer_buf.push_back(state.node);

        // state.nodeを選択したことで満たされる制約をカバーする
        for (DancingNode *j = state.node->right; j != state.node; j = j->right) {
            j->column->cover();
        }
        state.node->column->cover();

        if (header->isEmpty()) {
            // headerが空 => 解が見つかった
            assert(answer_buf.size() == SUDOKU_SIZE * SUDOKU_SIZE);
            num_answer++;
            if (answer.empty()) {
                answer = answer_buf;
            }
            // state.nodeを選択したという設定を元に戻す
            for (DancingNode *j = state.node->left; j != state.node; j = j->left) {
                j->column->uncover();
            }
            state.node->column->uncover();

            // 解が1つ欲しいだけの場合は探索を打ち切る
            if (just_answer) {
                return;
            }

            continue;
        }

        // 次の列を選択する
        ColumnNode *next_column = header->selectMinSizeColumn();
        for (DancingNode *i = next_column->down; i != next_column; i = i->down) {
            search_stack.push({state.index + 1, i});
        }
    }

    return;
}
