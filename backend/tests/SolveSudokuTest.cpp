#include <gtest/gtest.h>

#include "solver/SudokuSolver.hpp"
#include "solver/SudokuType.hpp"

TEST(SudokuSolveTest, testSolve) {
  const Sudoku::Board input = {{
      {8, 0, 0, 0, 0, 0, 0, 0, 0},
      {0, 0, 3, 6, 0, 0, 0, 0, 0},
      {0, 7, 0, 0, 9, 0, 2, 0, 0},
      {0, 5, 0, 0, 0, 7, 0, 0, 0},
      {0, 0, 0, 0, 4, 5, 7, 0, 0},
      {0, 0, 0, 1, 0, 0, 0, 3, 0},
      {0, 0, 1, 0, 0, 0, 0, 6, 8},
      {0, 0, 8, 5, 0, 0, 0, 1, 0},
      {0, 9, 0, 0, 0, 0, 4, 0, 0},
  }};

  Sudoku::Board output;
  int num_answer;
  bool is_exact_num_answer;
  Sudoku::solve(input, output, num_answer, is_exact_num_answer);

  Sudoku::Board expected_output = {{
      {8, 1, 2, 7, 5, 3, 6, 4, 9},
      {9, 4, 3, 6, 8, 2, 1, 7, 5},
      {6, 7, 5, 4, 9, 1, 2, 8, 3},
      {1, 5, 4, 2, 3, 7, 8, 9, 6},
      {3, 6, 9, 8, 4, 5, 7, 2, 1},
      {2, 8, 7, 1, 6, 9, 5, 3, 4},
      {5, 2, 1, 9, 7, 4, 3, 6, 8},
      {4, 3, 8, 5, 2, 6, 9, 1, 7},
      {7, 9, 6, 3, 1, 8, 4, 5, 2},
  }};
  int expected_num_answer = 1;
  bool expected_is_exact_num_answer = true;

  EXPECT_EQ(output, expected_output);
  EXPECT_EQ(num_answer, expected_num_answer);
  EXPECT_EQ(is_exact_num_answer, expected_is_exact_num_answer);
}
