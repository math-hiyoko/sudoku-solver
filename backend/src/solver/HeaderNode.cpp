#include "solver/HeaderNode.hpp"

#include <algorithm>
#include <cassert>
#include <iterator>
#include <limits>
#include <stack>
#include <vector>

#include "solver/ColumnNode.hpp"
#include "solver/DancingNode.hpp"
#include "solver/IDancingLinksNode.hpp"
#include "solver/RowNode.hpp"
#include "solver/SudokuType.hpp"

namespace DancingLinks {
HeaderNode::HeaderNode() : IDancingLinksNode() {}

bool HeaderNode::isEmpty() const { return this->right == this; }

ColumnNode *HeaderNode::selectMinSizeColumn() const {
  ColumnNode *ret = nullptr;
  int minSize = std::numeric_limits<int>::max();
  for (IDancingLinksNode *i = this->right; i != this && minSize > 0; i = i->right) {
    ColumnNode *const column_node = static_cast<ColumnNode *>(i);
    if (column_node->size < minSize) {
      minSize = column_node->size;
      ret = column_node;
    }
  }
  return ret;
}

void HeaderNode::knuths_algorithm(std::vector<RowNode *> &solution, int &num_solutions,
                                  bool &is_exact_num_solutions, const bool &just_solution,
                                  const int &max_num_solutions) {
  num_solutions = 0;
  is_exact_num_solutions = true;

  // 探索中の状態を保存するための構造体
  struct NodeState {
    const int index;          // solution_buf中の何番目の要素になるか
    DancingNode *const node;  // 選択したノード

    NodeState(const int index, DancingNode *const node) : index(index), node(node) {}
  };

  // 探索中の状態を保存するスタック
  std::stack<NodeState> search_stack;
  // 解の候補を保存するためのバッファ
  std::vector<DancingNode *> solution_buf;

  do {
    int next_index = 0;  // 次がsolution_buf中の何番目の要素になるか

    if (!search_stack.empty()) [[likely]] {
      const NodeState state = search_stack.top();
      search_stack.pop();

      next_index = state.index + 1;

      // stateをindex番目の要素にするために、indexより後ろの要素の反映を元に戻す
      // coverした順に戻さないといけない
      for (int i = solution_buf.size() - 1; i >= state.index; i--) {
        // solution_buf[i]を選択したという設定を元に戻す
        solution_buf[i]->uncover();
      }
      solution_buf.resize(state.index);

      // state.nodeを選択したことにして反映を行う
      state.node->cover();
      solution_buf.emplace_back(state.node);

      if (this->isEmpty()) {
        // headerが空 => 解が見つかった
        assert(solution_buf.size() == Sudoku::SIZE * Sudoku::SIZE);
        num_solutions++;
        if (solution.empty()) [[unlikely]] {
          std::transform(solution_buf.begin(), solution_buf.end(), std::back_inserter(solution),
                         [](DancingNode *node) { return node->row; });
        }

        // state.nodeを選択したという設定を元に戻す
        state.node->uncover();
        solution_buf.pop_back();

        if (just_solution || num_solutions >= max_num_solutions) [[unlikely]] {
          is_exact_num_solutions = search_stack.empty();
          break;
        }

        continue;
      }
    }

    // 次の列を選択する
    const ColumnNode *const next_column = this->selectMinSizeColumn();
    for (IDancingLinksBodyNode *i = next_column->down; i != next_column; i = i->down) {
      search_stack.emplace(next_index, static_cast<DancingNode *>(i));
    }
  } while (!search_stack.empty());

  return;
}  // knuths_algorithm
}  // namespace DancingLinks
