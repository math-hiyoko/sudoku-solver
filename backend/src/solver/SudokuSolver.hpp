#pragma once

#include <vector>

#include <boost/pool/object_pool.hpp>

#include "ColumnNode.hpp"
#include "DancingNode.hpp"
#include "HeaderNode.hpp"
#include "SudokuType.hpp"


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
 * @param column_node_pool ColumnNodeのプール
 * @return HeaderNode* 生成したノードのヘッダー
 */
void makeNodesFromBoard(const SudokuBoard& board, HeaderNode* header, boost::object_pool<DancingNode>& dancing_node_pool, boost::object_pool<ColumnNode>& column_node_pool);

/**
 * @brief knuths_algorithmによってえられたDancingNodeから数独の盤面を復元する
 * 
 * @param answer knuths_algorithmによってえられたDancingNode
 * @param board 復元した数独の盤面
 */
void makeBoardFromAnswer(const std::vector<DancingNode*>& answer, SudokuBoard& board);

/**
 * @brief 数独の盤面を解く
 * 
 * @param board 数独の盤面
 * @param num_answer 解の数
 * @param answer 解のリスト
 */
void solveSudoku(const SudokuBoard& board, int& num_answer, SudokuBoard& answer);
