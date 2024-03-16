#pragma once

#include <boost/pool/object_pool.hpp>
#include <vector>

#include "solver/ColumnNode.hpp"
#include "solver/DancingNode.hpp"
#include "solver/HeaderNode.hpp"
#include "solver/RowNode.hpp"
#include "solver/SudokuType.hpp"

namespace Sudoku {
/**
 * @brief 数独の盤面を表す行列被覆問題の行列
 *
 * 何も数字が入っていないときの数独の盤面の状態を表す行列被覆問題の行列を表す
 */
consteval ExactCoverMatrix makeFullMatrix();

/**
 * @brief 現在の数独の盤面の状態を表す行列被覆問題のノードを生成する
 *
 * @param board 数独の盤面
 * @param header 行列被覆問題のヘッダー
 * @param dancing_node_pool DancingNodeのプール
 * @param row_node_pool RowNodeのプール
 * @param column_node_pool ColumnNodeのプール
 * @return HeaderNode* 生成したノードのヘッダー
 */
void makeNodesFromBoard(const Board& board, DancingLinks::HeaderNode* header,
                        boost::object_pool<DancingLinks::DancingNode>& dancing_node_pool,
                        boost::object_pool<DancingLinks::RowNode>& row_node_pool,
                        boost::object_pool<DancingLinks::ColumnNode>& column_node_pool);

/**
 * @brief knuths_algorithmによってえられたDancingNodeから数独の盤面を復元する
 *
 * @param answer knuths_algorithmによってえられたRowNode
 * @param board 復元した数独の盤面
 */
void makeBoardFromAnswer(const std::vector<DancingLinks::RowNode*>& answer, Board& board);

/**
 * @brief 数独の盤面を解く、一番メインの関数
 *
 * @param board 数独の盤面
 * @param num_answer 解の数
 * @param answer 解のリスト
 */
void solve(const Board& board, Board& answer, int& num_answer, bool& is_exact_num_answer,
           const bool just_answer = false, const int max_num_answer = MAX_NUM_ANSWER);
}  // namespace Sudoku
