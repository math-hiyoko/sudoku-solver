#include "solver/KnuthsAlgorithm.hpp"

#include <algorithm>
#include <cassert>
#include <iterator>
#include <stack>
#include <vector>

#include "solver/ColumnNode.hpp"
#include "solver/HeaderNode.hpp"
#include "solver/RowNode.hpp"
#include "solver/SudokuType.hpp"

namespace DancingLinks {
void knuths_algorithm(HeaderNode *header, std::vector<RowNode *> &solution, int &num_solutions,
                      bool &is_exact_num_solutions, const bool just_solution,
                      const int max_num_solutions) {
  // 探索中の状態を保存するための構造体
  struct NodeState {
    int index;          // solution_buf中の何番目の要素になるか
    DancingNode *node;  // 選択したノード
  };

  // 探索中の状態を保存するスタック
  std::stack<NodeState> search_stack;
  // 最初は最も少ない行数の列を選択する
  ColumnNode *column = header->selectMinSizeColumn();

  assert(column != nullptr);
  if (!column->isSatisfiable()) {
    num_solutions = 0;
    return;
  }

  // この列の条件を満たす選択肢を全てスタックに積む
  for (DancingNode *i = column->down; i != column; i = i->down) {
    search_stack.push(NodeState{.index = 0, .node = i});
  }

  // 解の候補を保存するためのバッファ
  std::vector<DancingNode *> solution_buf;

  while (!search_stack.empty()) {
    NodeState state = search_stack.top();
    search_stack.pop();

    // stateをindex番目の要素にするために、indexより後ろの要素の反映を元に戻す
    // coverした順に戻さないといけない
    for (int i = solution_buf.size() - 1; i >= state.index; i--) {
      // solution_buf[i]を選択したという設定を元に戻す
      solution_buf[i]->uncover();
    }
    solution_buf.resize(state.index);

    // state.nodeを選択したことにして反映を行う
    state.node->cover();
    solution_buf.push_back(state.node);

    if (header->isEmpty()) {
      // headerが空 => 解が見つかった
      assert(solution_buf.size() == Sudoku::SIZE * Sudoku::SIZE);
      num_solutions++;
      if (solution.empty()) {
        std::transform(solution_buf.begin(), solution_buf.end(), std::back_inserter(solution),
                       [](DancingNode *node) { return node->row; });
      }

      // state.nodeを選択したという設定を元に戻す
      state.node->uncover();
      solution_buf.pop_back();

      // 解が1つ欲しいだけの場合は探索を打ち切る
      if (just_solution || num_solutions >= max_num_solutions) {
        is_exact_num_solutions = search_stack.empty();
        return;
      }

      continue;
    }

    // 次の列を選択する
    ColumnNode *next_column = header->selectMinSizeColumn();
    for (DancingNode *i = next_column->down; i != next_column; i = i->down) {
      search_stack.push(NodeState{.index = state.index + 1, .node = i});
    }
  }

  is_exact_num_solutions = true;
  return;
}  // knuths_algorithm
}  // namespace DancingLinks
