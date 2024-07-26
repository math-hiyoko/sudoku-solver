#include <gtest/gtest.h>

#include "solver/SudokuSolver.hpp"
#include "solver/SudokuType.hpp"

// 16x16の数独の解を求めるテスト
#if defined(SUDOKU_DIM) && SUDOKU_DIM == 4
TEST(Sudoku16x16SolveTest, testRegularSolve) {
  const Sudoku::Board input = {{
      {16, 15, 14, 13, 12, 11, 10, 0, 8, 7, 6, 5, 4, 3, 2, 1},
      {4, 6, 2, 8, 0, 5, 1, 3, 9, 0, 11, 12, 13, 14, 0, 0},
      {5, 0, 3, 1, 8, 2, 4, 6, 13, 14, 15, 0, 9, 10, 0, 12},
      {9, 10, 0, 12, 13, 14, 15, 16, 2, 3, 4, 1, 5, 6, 7, 8},
      {7, 4, 9, 14, 0, 0, 3, 10, 11, 13, 1, 2, 8, 12, 0, 5},
      {12, 2, 15, 5, 11, 8, 7, 4, 6, 9, 16, 14, 3, 1, 10, 13},
      {3, 0, 8, 0, 1, 9, 0, 5, 15, 12, 7, 4, 2, 0, 6, 0},
      {1, 0, 6, 16, 2, 12, 13, 14, 3, 5, 10, 8, 7, 4, 9, 0},
      {8, 1, 10, 2, 4, 7, 11, 12, 14, 16, 13, 15, 6, 0, 5, 3},
      {11, 3, 13, 7, 0, 0, 9, 15, 5, 6, 12, 10, 1, 2, 8, 4},
      {14, 9, 16, 0, 0, 6, 5, 8, 1, 2, 3, 0, 12, 15, 13, 7},
      {6, 5, 0, 15, 3, 1, 2, 13, 7, 4, 8, 9, 10, 16, 14, 11},
      {10, 8, 1, 9, 16, 3, 6, 7, 0, 15, 0, 0, 11, 5, 4, 2},
      {13, 16, 5, 3, 15, 10, 12, 2, 4, 11, 9, 7, 14, 8, 1, 6},
      {2, 0, 0, 6, 9, 13, 8, 11, 16, 1, 5, 3, 15, 7, 12, 10},
      {15, 12, 7, 0, 5, 4, 14, 1, 10, 8, 2, 6, 0, 0, 3, 9},
  }};

  Sudoku::Board output;
  int num_solutions;
  bool is_exact_num_solutions;
  Sudoku::solve(input, output, num_solutions, is_exact_num_solutions);

  Sudoku::Board expected_output = {{
      {16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1},
      {4, 6, 2, 8, 7, 5, 1, 3, 9, 10, 11, 12, 13, 14, 15, 16},
      {5, 7, 3, 1, 8, 2, 4, 6, 13, 14, 15, 16, 9, 10, 11, 12},
      {9, 10, 11, 12, 13, 14, 15, 16, 2, 3, 4, 1, 5, 6, 7, 8},
      {7, 4, 9, 14, 6, 15, 3, 10, 11, 13, 1, 2, 8, 12, 16, 5},
      {12, 2, 15, 5, 11, 8, 7, 4, 6, 9, 16, 14, 3, 1, 10, 13},
      {3, 13, 8, 10, 1, 9, 16, 5, 15, 12, 7, 4, 2, 11, 6, 14},
      {1, 11, 6, 16, 2, 12, 13, 14, 3, 5, 10, 8, 7, 4, 9, 15},
      {8, 1, 10, 2, 4, 7, 11, 12, 14, 16, 13, 15, 6, 9, 5, 3},
      {11, 3, 13, 7, 14, 16, 9, 15, 5, 6, 12, 10, 1, 2, 8, 4},
      {14, 9, 16, 4, 10, 6, 5, 8, 1, 2, 3, 11, 12, 15, 13, 7},
      {6, 5, 12, 15, 3, 1, 2, 13, 7, 4, 8, 9, 10, 16, 14, 11},
      {10, 8, 1, 9, 16, 3, 6, 7, 12, 15, 14, 13, 11, 5, 4, 2},
      {13, 16, 5, 3, 15, 10, 12, 2, 4, 11, 9, 7, 14, 8, 1, 6},
      {2, 14, 4, 6, 9, 13, 8, 11, 16, 1, 5, 3, 15, 7, 12, 10},
      {15, 12, 7, 11, 5, 4, 14, 1, 10, 8, 2, 6, 16, 13, 3, 9},
  }};
  int expected_num_solutions = 1;
  bool expected_is_exact_num_solutions = true;

  EXPECT_EQ(output, expected_output);
  EXPECT_EQ(num_solutions, expected_num_solutions);
  EXPECT_EQ(is_exact_num_solutions, expected_is_exact_num_solutions);
}

TEST(Sudoku16x16SolveTest, testEmptySolve) {
  const Sudoku::Board input = {{
      {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
      {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
      {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
      {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
      {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
      {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
      {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
      {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
      {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
      {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
      {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
      {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
      {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
      {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
      {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
      {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
  }};

  Sudoku::Board output;
  int num_solutions;
  bool is_exact_num_solutions;
  Sudoku::solve(input, output, num_solutions, is_exact_num_solutions);

  int expected_num_solutions = Sudoku::MAX_NUM_SOLUTIONS;
  bool expected_is_exact_num_solutions = false;

  EXPECT_EQ(num_solutions, expected_num_solutions);
  EXPECT_EQ(is_exact_num_solutions, expected_is_exact_num_solutions);
}

TEST(Sudoku16x16SolveTest, testMultipleOneSolution) {
  const Sudoku::Board input = {{
      {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
      {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
      {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
      {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
      {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
      {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
      {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
      {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
      {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
      {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
      {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
      {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
      {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
      {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
      {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
      {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
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
