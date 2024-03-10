#pragma once

#include <vector>

#include <boost/pool/object_pool.hpp>

#include "ColumnNode.hpp"
#include "DancingNode.hpp"
#include "HeaderNode.hpp"
#include "SudokuType.hpp"


/**
 * 行列に入れる際のインデックスを取得する
 * key1 key2 key3をSUDOKU_SIZE進数とみなして計算しているだけ
*/
constexpr int getIdx(int key1, int key2, int key3);

/**
 * @brief 数独の盤面を表す行列被覆問題の行列
 * 
 * 何も数字が入っていないときの数独の盤面の状態を表す行列被覆問題の行列を表す
 */
consteval ExactCoverMatrix makeFullMatrix();

/**
 * @brief 入力された数独の盤面に対応する行列被覆問題の行列を生成する
 * 
 * @param board 数独の盤面
 * @return ExactCoverMatrix 生成した行列被覆問題の行列
 */
void makeMatrixFromBoard(const SudokuBoard& board, ExactCoverMatrix& matrix);

/**
 * @brief 現在の数独の盤面の状態を表す行列被覆問題のノードを生成する
 * 
 * @param board 数独の盤面
 * @param dancing_node_pool DancingNodeのプール
 * @param column_node_pool ColumnNodeのプール
 * @return HeaderNode* 生成したノードのヘッダー
 */
HeaderNode* makeNodesFromMatrix(const ExactCoverMatrix& matrix, boost::object_pool<DancingNode>& dancing_node_pool, boost::object_pool<ColumnNode>& column_node_pool);

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
void solveSudoku(const SudokuBoard& board, int& num_answer, std::vector<SudokuBoard>& answer);
