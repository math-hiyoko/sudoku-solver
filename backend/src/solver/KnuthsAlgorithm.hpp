#pragma once

#include <memory>
#include <vector>

#include "ColumnNode.hpp"
#include "HeaderNode.hpp"
#include "SudokuType.hpp"


/**
 * @brief 行列被覆問題を解く関数
 * 
 * 行列被覆問題はKnuthsAlgorithmというアルゴリズムで解くことができる
 * 制約を満たせる行が最も少ない列を選び、その列に対する選択肢を決め打ちして探索する
*/
void knuths_algorithm(
    HeaderNode &header,
    int &num_answer,
    std::vector<DancingNode*> &answer,
    std::unique_ptr<std::vector<DancingNode*>> answer_buf = std::make_unique<std::vector<DancingNode*>>()
) {
    // headerが空 => 解が見つかった
    if (header.isEmpty()) {
        assert(answer_buf->size() == SUDOKU_SIZE * SUDOKU_SIZE);
        num_answer++;

        if (answer.empty()) {
            answer = *answer_buf;
        }

        return;
    }

    // 残っている行数が最も少ない列の条件を満たすことを考える
    ColumnNode *column = header.selectMinSizeColumn();
    column->cover();
    // columnを満たす要素を走査する
    for (DancingNode *i = column->down; i != column; i = i->down) {
        // columnを満たす要素であるiを選択する
        answer_buf->push_back(i);

        // iを選択したことで満たされる制約を満たす要素を選択する
        for (DancingNode *j = i->right; j != i; j = j->right) {
            j->column->cover();
        }

        // 次の列を選択する
        knuths_algorithm(header, num_answer, answer, std::move(answer_buf));

        // iを選択したという設定を元に戻す
        for (DancingNode *j = i->left; j != i; j = j->left) {
            j->column->uncover();
        }
        answer_buf->pop_back();
    }

    column->uncover();

    return;
}
