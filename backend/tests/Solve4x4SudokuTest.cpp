#include <gtest/gtest.h>

#include "solver/SudokuSolver.hpp"
#include "solver/SudokuType.hpp"

// 4x4の数独の解を求めるテスト
#if defined(SUDOKU_DIM) && SUDOKU_DIM == 2
TEST(Sudoku4x4SolveTest, testRegularSolve) {
  const Sudoku::Board input = {{
      {1, 0, 0, 0},
      {0, 2, 3, 0},
      {0, 0, 0, 4},
      {0, 0, 0, 0},
  }};

  Sudoku::Board output;
  int num_answer;
  bool is_exact_num_answer;
  Sudoku::solve(input, output, num_answer, is_exact_num_answer);

  Sudoku::Board expected_output = {{
      {1, 3, 4, 2},
      {4, 2, 3, 1},
      {3, 1, 2, 4},
      {2, 4, 1, 3},
  }};
  int expected_num_answer = 1;
  bool expected_is_exact_num_answer = true;

  EXPECT_EQ(output, expected_output);
  EXPECT_EQ(num_answer, expected_num_answer);
  EXPECT_EQ(is_exact_num_answer, expected_is_exact_num_answer);
}

TEST(Sudoku4x4SolveTest, testEmptySolve) {
  const Sudoku::Board input = {{
      {0, 0, 0, 0},
      {0, 0, 0, 0},
      {0, 0, 0, 0},
      {0, 0, 0, 0},
  }};

  Sudoku::Board output;
  int num_answer;
  bool is_exact_num_answer;
  Sudoku::solve(input, output, num_answer, is_exact_num_answer);

  Sudoku::Board expected_output = {{
      {4, 3, 2, 1},
      {2, 1, 3, 4},
      {1, 2, 4, 3},
      {3, 4, 1, 2},
  }};
  int expected_num_answer = std::min(288, Sudoku::MAX_NUM_ANSWER);
  bool expected_is_exact_num_answer = 288 <= Sudoku::MAX_NUM_ANSWER ? true : false;

  EXPECT_EQ(output, expected_output);
  EXPECT_EQ(num_answer, expected_num_answer);
  EXPECT_EQ(is_exact_num_answer, expected_is_exact_num_answer);
}

TEST(Sudoku4x4SolveTest, testMultipleOneAnswer) {
  const Sudoku::Board input = {{
      {0, 0, 0, 0},
      {0, 0, 0, 0},
      {0, 0, 0, 0},
      {0, 0, 0, 0},
  }};

  Sudoku::Board output;
  int num_answer;
  bool is_exact_num_answer;
  Sudoku::solve(input, output, num_answer, is_exact_num_answer, true);

  Sudoku::Board expected_output = {{
      {4, 3, 2, 1},
      {2, 1, 3, 4},
      {1, 2, 4, 3},
      {3, 4, 1, 2},
  }};
  int expected_num_answer = 1;
  bool expected_is_exact_num_answer = false;

  EXPECT_EQ(output, expected_output);
  EXPECT_EQ(num_answer, expected_num_answer);
  EXPECT_EQ(is_exact_num_answer, expected_is_exact_num_answer);
}
#endif
