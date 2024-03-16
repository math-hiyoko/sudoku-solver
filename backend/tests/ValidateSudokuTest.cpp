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
      Sudoku::Option{0, 5, -1},
      Sudoku::Option{5, 0, 10},
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
      Sudoku::Constraint{Sudoku::ConstraintEnum::ROW, 2, 9},
      Sudoku::Constraint{Sudoku::ConstraintEnum::ROW, 6, 1},
      Sudoku::Constraint{Sudoku::ConstraintEnum::COLUMN, 2, 3},
      Sudoku::Constraint{Sudoku::ConstraintEnum::COLUMN, 3, 1},
      Sudoku::Constraint{Sudoku::ConstraintEnum::BLOCK, 0, 3},
      Sudoku::Constraint{Sudoku::ConstraintEnum::BLOCK, 1, 9},
  };
  int expected_num_invalid = 6;

  EXPECT_EQ(constraints, expected_constraints);
  EXPECT_EQ(num_invalid, expected_num_invalid);
}
#endif
