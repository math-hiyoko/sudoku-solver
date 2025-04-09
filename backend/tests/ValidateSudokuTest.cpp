#include <gtest/gtest.h>

#include <vector>

#include "solver/SudokuType.hpp"
#include "solver/SudokuValidator.hpp"

#if defined(SUDOKU_LEVEL) && SUDOKU_LEVEL == 3
TEST(ValidateSolveTest, testValidrange) {
  const Sudoku::Board input = {{
      {8, 0, 0, 0, 0, -1, 0, 0, 0},
      {0, 0, 3, 6, 0, 0, 0, 0, 0},
      {0, 7, 0, 0, 9, 0, 2, 0, 0},
      {0, 5, 0, 0, 0, 7, 0, 0, 0},
      {0, 0, 0, 0, 4, 5, 7, 0, 0},
      {10, 0, 0, 1, 0, 0, 0, 3, 0},
      {0, 0, 1, 0, 0, 0, 0, 6, 8},
      {0, 0, 8, 5, 0, 0, 0, 1, 0},
      {0, 9, 0, 0, 0, 0, 4, 0, 0},
  }};
  std::vector<Sudoku::Option> options;
  int num_invalid = Sudoku::isValidRange(input, options);

  std::vector<Sudoku::Option> expected_options = {
      Sudoku::Option{.row = 0, .column = 5, .number = -1},
      Sudoku::Option{.row = 5, .column = 0, .number = 10},
  };
  int expected_num_invalid = 2;

  EXPECT_EQ(options, expected_options);
  EXPECT_EQ(num_invalid, expected_num_invalid);
}

TEST(ValidateSolveTest, testisSatisfy) {
  const Sudoku::Board input = {{
      {8, 0, 3, 0, 0, 0, 0, 0, 0},
      {0, 0, 3, 6, 0, 0, 0, 0, 0},
      {0, 7, 0, 0, 9, 9, 2, 0, 0},
      {0, 5, 0, 0, 0, 7, 0, 0, 0},
      {0, 0, 0, 0, 4, 5, 7, 0, 0},
      {0, 0, 0, 1, 0, 0, 0, 3, 0},
      {0, 0, 1, 1, 0, 0, 0, 6, 8},
      {0, 0, 8, 5, 0, 0, 0, 1, 0},
      {0, 9, 0, 0, 0, 0, 4, 0, 0},
  }};
  std::vector<Sudoku::Option> options;
  int num_invalid = Sudoku::isSatisfy(input, options);

  std::vector<Sudoku::Option> expected_options = {
      Sudoku::Option{.row = 0, .column = 2, .number = 3},
      Sudoku::Option{.row = 1, .column = 2, .number = 3},
      Sudoku::Option{.row = 2, .column = 4, .number = 9},
      Sudoku::Option{.row = 2, .column = 5, .number = 9},
      Sudoku::Option{.row = 5, .column = 3, .number = 1},
      Sudoku::Option{.row = 6, .column = 2, .number = 1},
      Sudoku::Option{.row = 6, .column = 3, .number = 1},
  };
  int expected_num_invalid = 7;

  EXPECT_EQ(options, expected_options);
  EXPECT_EQ(num_invalid, expected_num_invalid);
}

TEST(ValidateSolveTest, testisCorrect) {
  const Sudoku::Board input = {{
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
  bool is_correct;
  int num_invalid = Sudoku::isCorrect(input, is_correct);
  bool expected_is_correct = true;
  int expected_num_invalid = 0;
  EXPECT_EQ(is_correct, expected_is_correct);
  EXPECT_EQ(num_invalid, expected_num_invalid);
}
#endif
