#include "solver/HeaderNode.hpp"

#include <algorithm>
#include <boost/pool/object_pool.hpp>
#include <cassert>
#include <iterator>
#include <limits>
#include <map>
#include <queue>
#include <stack>
#include <vector>

#include "solver/ColumnNode.hpp"
#include "solver/DancingNode.hpp"
#include "solver/IDancingLinksBodyNode.hpp"
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

HeaderNode *HeaderNode::clone(
    boost::object_pool<DancingLinks::DancingNode> &dancing_node_pool,
    boost::object_pool<DancingLinks::ColumnNode> &column_node_pool,
    boost::object_pool<DancingLinks::HeaderNode> &header_node_pool) const {
  HeaderNode *new_header = header_node_pool.construct();
  if (this->right == this) [[unlikely]] {
    return new_header;
  }

  // 全てのColumnNodeとDancingNodeを複製する
  std::map<RowNode *, DancingNode *> row_map;
  for (IDancingLinksNode *i = this->right; i != this; i = i->right) {
    ColumnNode *const column_node = static_cast<ColumnNode *>(i);
    ColumnNode *const new_column_node = column_node_pool.construct();
    new_header->hookLeft(new_column_node);
    for (IDancingLinksBodyNode *j = column_node->down; j != column_node; j = j->down) {
      DancingNode *const dancing_node = static_cast<DancingNode *>(j);
      DancingNode *const new_dancing_node =
          dancing_node_pool.construct(dancing_node->row, new_column_node);
      new_column_node->hookUp(new_dancing_node);
      new_column_node->size++;
      // DancingNodeの横方向のリンクを張り直す
      if (row_map.contains(new_dancing_node->row)) {
        row_map[new_dancing_node->row]->hookLeft(new_dancing_node);
      } else {
        row_map[new_dancing_node->row] = new_dancing_node;
      }
    }
  }

  return new_header;
}

void HeaderNode::solve(std::vector<RowNode *> &solution, int &num_solutions,
                                  bool &is_exact_num_solutions, const bool &just_solution,
                                  const int &max_num_solutions) {
  const int max_num_solutions_ = just_solution ? 1 : max_num_solutions;

  num_solutions = 0;
  is_exact_num_solutions = true;

  struct SearchBranch {
    std::vector<RowNode *> solution_prefix;
    HeaderNode *header;

    SearchBranch(const std::vector<RowNode *> &sol_prefix, HeaderNode *hdr)
        : solution_prefix(sol_prefix), header(hdr) {}

    SearchBranch() = default;
  };
  boost::object_pool<DancingLinks::DancingNode> dancing_node_pool;
  boost::object_pool<DancingLinks::ColumnNode> column_node_pool;
  boost::object_pool<DancingLinks::HeaderNode> header_node_pool;

  std::queue<SearchBranch> search_queue;
  search_queue.emplace(std::vector<RowNode *>(), this);
  while (!search_queue.empty() && search_queue.size() < Sudoku::NUM_BRANCH) {
    auto [solution_prefix, header] = search_queue.front();
    search_queue.pop();

    const ColumnNode *const next_column = header->selectMinSizeColumn();
    for (IDancingLinksBodyNode *i = next_column->up; i != next_column; i = i->up) {
      DancingNode *const dancing_node = static_cast<DancingNode *>(i);
      dancing_node->cover();
      solution_prefix.emplace_back(dancing_node->row);
      if (header->isEmpty()) {
        // 解が見つかった
        num_solutions++;
        if (solution.empty()) [[unlikely]] {
          std::transform(solution_prefix.begin(), solution_prefix.end(),
                         std::back_inserter(solution), [](RowNode *node) { return node; });
        }
        if (max_num_solutions_ == 1) [[unlikely]] {
          is_exact_num_solutions = false;
          return;
        }
      } else {
        std::vector<RowNode *> new_solution_prefix(solution_prefix);
        search_queue.emplace(new_solution_prefix,
                             header->clone(dancing_node_pool, column_node_pool, header_node_pool));
      }
      dancing_node->uncover();
      solution_prefix.pop_back();
    }
  }

  // 探索中の状態を保存するための構造体
  struct NodeState {
    const int index;          // solution_buf中の何番目の要素になるか
    DancingNode *const node;  // 選択したノード

    NodeState(const int idx, DancingNode *const nd) : index(idx), node(nd) {}
  };

  std::vector<SearchBranch> search_branches;
  while (!search_queue.empty()) {
    search_branches.push_back(search_queue.front());
    search_queue.pop();
  }

#pragma omp parallel for shared(num_solutions, is_exact_num_solutions, search_branches, solution)
  for (int i = 0; i < search_branches.size(); i++) {
    if (num_solutions >= max_num_solutions_) [[unlikely]] {
      is_exact_num_solutions = false;
      continue;
    }

    const auto [solution_prefix, header] = search_branches[i];
    // 探索中の状態を保存するスタック
    std::stack<NodeState> search_stack;
    // 解の候補を保存するためのバッファ
    std::vector<DancingNode *> solution_buf;
    // この探索で一回でも解けたことがあるか
    bool already_solved_once = false;

    do {
      int next_index = 0;  // 次がsolution_buf中の何番目の要素になるか

      if (!search_stack.empty()) [[likely]] {
        auto [index, dancing_node] = search_stack.top();
        search_stack.pop();

        next_index = index + 1;

        // stateをindex番目の要素にするために、indexより後ろの要素の反映を元に戻す
        // coverした順に戻さないといけない
        for (int i = solution_buf.size() - 1; i >= index; i--) {
          // solution_buf[i]を選択したという設定を元に戻す
          solution_buf[i]->uncover();
        }
        solution_buf.resize(index);

        // dancing_nodeを選択したことにして反映を行う
        dancing_node->cover();
        solution_buf.emplace_back(dancing_node);

        if (header->isEmpty()) {
          // headerが空 => 解が見つかった
          assert(solution_prefix.size() + solution_buf.size() == Sudoku::SIZE * Sudoku::SIZE);

#pragma omp atomic
          num_solutions++;

          // ループ内ですでに解を見つけたのならここは見なくていい
          if (!already_solved_once) [[unlikely]] {
#pragma omp critical
            {
              if (solution.empty()) [[unlikely]] {
                std::transform(solution_prefix.begin(), solution_prefix.end(),
                               std::back_inserter(solution), [](RowNode *node) { return node; });
                std::transform(solution_buf.begin(), solution_buf.end(),
                               std::back_inserter(solution),
                               [](DancingNode *node) { return node->row; });
              }
            }
          }

          // dancing_nodeを選択したという設定を元に戻す
          dancing_node->uncover();
          solution_buf.pop_back();

          if (num_solutions >= max_num_solutions_) [[unlikely]] {
            is_exact_num_solutions = false;
            break;
          }

          continue;
        }
      }

      // 次の列を選択する
      const ColumnNode *const next_column = header->selectMinSizeColumn();
      for (IDancingLinksBodyNode *i = next_column->up; i != next_column; i = i->up) {
        search_stack.emplace(next_index, static_cast<DancingNode *>(i));
      }
    } while (!search_stack.empty());
  }

  if (num_solutions > max_num_solutions_) {
    num_solutions = max_num_solutions_;
    is_exact_num_solutions = false;
  }

  return;
}  // solve
}  // namespace DancingLinks
