#include <gtest/gtest.h>

#include <vector>

#include "solver/SudokuSolver.hpp"
#include "solver/SudokuType.hpp"
#include "solver/SudokuValidator.hpp"

// 9x9の数独の解を求めるテスト
#if defined(SUDOKU_LEVEL) && SUDOKU_LEVEL == 3
TEST(Sudoku9x9SolveTest, testRegularSolve) {
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

  std::vector<Sudoku::Board> output;
  int num_solutions;
  bool is_exact_num_solutions;
  Sudoku::solve(input, output, num_solutions, is_exact_num_solutions);

  std::vector<Sudoku::Board> expected_output = {{{
      {8, 1, 2, 7, 5, 3, 6, 4, 9},
      {9, 4, 3, 6, 8, 2, 1, 7, 5},
      {6, 7, 5, 4, 9, 1, 2, 8, 3},
      {1, 5, 4, 2, 3, 7, 8, 9, 6},
      {3, 6, 9, 8, 4, 5, 7, 2, 1},
      {2, 8, 7, 1, 6, 9, 5, 3, 4},
      {5, 2, 1, 9, 7, 4, 3, 6, 8},
      {4, 3, 8, 5, 2, 6, 9, 1, 7},
      {7, 9, 6, 3, 1, 8, 4, 5, 2},
  }}};
  int expected_num_solutions = 1;
  bool expected_is_exact_num_solutions = true;

  EXPECT_EQ(output, expected_output);
  EXPECT_EQ(num_solutions, expected_num_solutions);
  EXPECT_EQ(is_exact_num_solutions, expected_is_exact_num_solutions);
}

TEST(Sudoku9x9SolveTest, testEmptySolve) {
  const Sudoku::Board input = {{
      {0, 0, 0, 0, 0, 0, 0, 0, 0},
      {0, 0, 0, 0, 0, 0, 0, 0, 0},
      {0, 0, 0, 0, 0, 0, 0, 0, 0},
      {0, 0, 0, 0, 0, 0, 0, 0, 0},
      {0, 0, 0, 0, 0, 0, 0, 0, 0},
      {0, 0, 0, 0, 0, 0, 0, 0, 0},
      {0, 0, 0, 0, 0, 0, 0, 0, 0},
      {0, 0, 0, 0, 0, 0, 0, 0, 0},
      {0, 0, 0, 0, 0, 0, 0, 0, 0},
  }};
  std::vector<Sudoku::Board> output;
  int num_solutions;
  bool is_exact_num_solutions;
  Sudoku::solve(input, output, num_solutions, is_exact_num_solutions);

  int expected_num_solutions = Sudoku::MAX_NUM_SOLUTIONS;
  int expected_solutions = Sudoku::MAX_SOLUTIONS;
  bool expected_is_exact_num_solutions = false;

  EXPECT_EQ(num_solutions, expected_num_solutions);
  EXPECT_EQ(output.size(), expected_solutions);
  EXPECT_EQ(is_exact_num_solutions, expected_is_exact_num_solutions);
  for (const Sudoku::Board& solution : output) {
    bool is_correct;
    EXPECT_EQ(Sudoku::isCorrect(solution, is_correct), 0);
    EXPECT_TRUE(is_correct);
  }
}

TEST(Sudoku9x9SolveTest, testMultipleSolve) {
  const Sudoku::Board input = {{
      {8, 0, 0, 0, 0, 0, 0, 0, 3},
      {0, 0, 3, 6, 0, 0, 0, 0, 0},
      {0, 7, 0, 0, 9, 0, 2, 0, 0},
      {0, 5, 0, 0, 0, 7, 0, 0, 0},
      {0, 0, 0, 0, 0, 5, 7, 0, 0},
      {0, 0, 0, 1, 0, 0, 0, 0, 0},
      {0, 0, 1, 0, 0, 0, 0, 6, 8},
      {0, 0, 0, 0, 0, 0, 0, 1, 0},
      {0, 9, 0, 0, 0, 0, 4, 0, 0},
  }};
  std::vector<Sudoku::Board> output;
  int num_solutions;
  bool is_exact_num_solutions;
  Sudoku::solve(input, output, num_solutions, is_exact_num_solutions);

  int expected_num_solutions = std::min(284'505, Sudoku::MAX_NUM_SOLUTIONS);
  int expected_solutions = std::min(284'505, Sudoku::MAX_SOLUTIONS);
  bool expected_is_exact_num_solutions = 284'505 <= Sudoku::MAX_NUM_SOLUTIONS ? true : false;

  EXPECT_EQ(num_solutions, expected_num_solutions);
  EXPECT_EQ(output.size(), expected_solutions);
  EXPECT_EQ(is_exact_num_solutions, expected_is_exact_num_solutions);
  for (const Sudoku::Board& solution : output) {
    bool is_correct;
    EXPECT_EQ(Sudoku::isCorrect(solution, is_correct), 0);
    EXPECT_TRUE(is_correct);
  }
}

TEST(Sudoku9x9SolveTest, testMultipleOneSolution) {
  const Sudoku::Board input = {{
      {8, 0, 0, 0, 0, 0, 0, 0, 3},
      {0, 0, 3, 6, 0, 0, 0, 0, 0},
      {0, 7, 0, 0, 9, 0, 2, 0, 0},
      {0, 5, 0, 0, 0, 7, 0, 0, 0},
      {0, 0, 0, 0, 0, 5, 7, 0, 0},
      {0, 0, 0, 1, 0, 0, 0, 0, 0},
      {0, 0, 1, 0, 0, 0, 0, 6, 8},
      {0, 0, 0, 0, 0, 0, 0, 1, 0},
      {0, 9, 0, 0, 0, 0, 4, 0, 0},
  }};

  std::vector<Sudoku::Board> output;
  int num_solutions;
  bool is_exact_num_solutions;
  Sudoku::solve(input, output, num_solutions, is_exact_num_solutions, true);

  int expected_num_solutions = 1;
  int expected_solutions = 1;
  bool expected_is_exact_num_solutions = false;

  EXPECT_EQ(num_solutions, expected_num_solutions);
  EXPECT_EQ(output.size(), expected_solutions);
  EXPECT_EQ(is_exact_num_solutions, expected_is_exact_num_solutions);
  for (const Sudoku::Board& solution : output) {
    bool is_correct;
    EXPECT_EQ(Sudoku::isCorrect(solution, is_correct), 0);
    EXPECT_TRUE(is_correct);
  }
}
#endif
