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
  int num_solutions;
  bool is_exact_num_solutions;
  Sudoku::solve(input, output, num_solutions, is_exact_num_solutions);

  Sudoku::Board expected_output = {{
      {1, 3, 4, 2},
      {4, 2, 3, 1},
      {3, 1, 2, 4},
      {2, 4, 1, 3},
  }};
  int expected_num_solutions = 1;
  bool expected_is_exact_num_solutions = true;

  EXPECT_EQ(output, expected_output);
  EXPECT_EQ(num_solutions, expected_num_solutions);
  EXPECT_EQ(is_exact_num_solutions, expected_is_exact_num_solutions);
}

TEST(Sudoku4x4SolveTest, testEmptySolve) {
  const Sudoku::Board input = {{
      {0, 0, 0, 0},
      {0, 0, 0, 0},
      {0, 0, 0, 0},
      {0, 0, 0, 0},
  }};

  Sudoku::Board output;
  int num_solutions;
  bool is_exact_num_solutions;
  Sudoku::solve(input, output, num_solutions, is_exact_num_solutions);

  int expected_num_solutions = std::min(288, Sudoku::MAX_NUM_SOLUTIONS);
  bool expected_is_exact_num_solutions = 288 <= Sudoku::MAX_NUM_SOLUTIONS ? true : false;

  EXPECT_EQ(num_solutions, expected_num_solutions);
  EXPECT_EQ(is_exact_num_solutions, expected_is_exact_num_solutions);
}

TEST(Sudoku4x4SolveTest, testMultipleOneSolution) {
  const Sudoku::Board input = {{
      {0, 0, 0, 0},
      {0, 0, 0, 0},
      {0, 0, 0, 0},
      {0, 0, 0, 0},
  }};

  Sudoku::Board output;
  int num_solutions;
  bool is_exact_num_solutions;
  Sudoku::solve(input, output, num_solutions, is_exact_num_solutions, true);

  int expected_num_solutions = 1;
  bool expected_is_exact_num_solutions = false;

  EXPECT_EQ(num_solutions, expected_num_solutions);
  EXPECT_EQ(is_exact_num_solutions, expected_is_exact_num_solutions);
}
#endif
