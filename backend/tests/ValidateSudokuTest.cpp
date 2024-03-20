#include <gtest/gtest.h>

#include <vector>

#include "solver/SudokuType.hpp"
#include "solver/SudokuValidator.hpp"

#if defined(SUDOKU_DIM) && SUDOKU_DIM == 3
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
  std::vector<Sudoku::Constraint> constraints;
  int num_invalid = Sudoku::isSatisfy(input, constraints);

  std::vector<Sudoku::Constraint> expected_constraints = {
      Sudoku::Constraint{.type = Sudoku::ConstraintEnum::ROW, .key1 = 2, .key2 = 9},
      Sudoku::Constraint{.type = Sudoku::ConstraintEnum::ROW, .key1 = 6, .key2 = 1},
      Sudoku::Constraint{.type = Sudoku::ConstraintEnum::COLUMN, .key1 = 2, .key2 = 3},
      Sudoku::Constraint{.type = Sudoku::ConstraintEnum::COLUMN, .key1 = 3, .key2 = 1},
      Sudoku::Constraint{.type = Sudoku::ConstraintEnum::BLOCK, .key1 = 0, .key2 = 3},
      Sudoku::Constraint{.type = Sudoku::ConstraintEnum::BLOCK, .key1 = 1, .key2 = 9},
  };
  int expected_num_invalid = 6;

  EXPECT_EQ(constraints, expected_constraints);
  EXPECT_EQ(num_invalid, expected_num_invalid);
}
#endif
