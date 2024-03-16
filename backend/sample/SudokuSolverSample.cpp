#include <iostream>
#include <sstream>
#include <string>
#include <vector>

#include "solver/SudokuSolver.hpp"
#include "solver/SudokuType.hpp"
#include "solver/SudokuValidator.hpp"

int validateRange(const Sudoku::Board& board) {
  std::vector<Sudoku::Option> options;
  int num_invalid = Sudoku::isValidRange(board, options);
  if (num_invalid != 0) {
    std::cerr << "Invalid range" << std::endl;
    for (const Sudoku::Option option : options) {
      std::cerr << "Invalid value: " << option.number << " at (" << option.row << ", "
                << option.column << ")" << std::endl;
    }
    return num_invalid;
  }
  return 0;
}

int validateSatisfy(const Sudoku::Board& board) {
  std::vector<Sudoku::Constraint> constraints;
  int num_invalid = Sudoku::isSatisfy(board, constraints);
  if (num_invalid != 0) {
    std::cerr << "Invalid constraints" << std::endl;
    for (const Sudoku::Constraint constraint : constraints) {
      switch (constraint.type) {
        case Sudoku::ConstraintEnum::ROW:
          std::cerr << "Row " << constraint.key1 << " has " << constraint.key2 << " more than once"
                    << std::endl;
          break;
        case Sudoku::ConstraintEnum::COLUMN:
          std::cerr << "Column " << constraint.key1 << " has " << constraint.key2
                    << " more than once" << std::endl;
          break;
        case Sudoku::ConstraintEnum::BLOCK:
          std::cerr << "Block " << constraint.key1 << " has " << constraint.key2
                    << " more than once" << std::endl;
          break;
        default:
          break;
      }
    }
    return num_invalid;
  }
  return 0;
}

int input(Sudoku::Board& board) {
  std::string line;
  for (int i = 0; i < Sudoku::SIZE && std::getline(std::cin, line); i++) {
    std::stringstream stream(line);
    std::vector<int> row;
    int number;
    while (stream >> number) {
      row.push_back(number);
    }
    if (row.size() != Sudoku::SIZE) {
      std::cerr << "Invalid input" << std::endl;
      return 1;
    }
    for (int j = 0; j < Sudoku::SIZE; j++) {
      board[i][j] = row[j];
    }
  }
  return 0;
}

int main() {
  Sudoku::Board board;
  if (input(board) != 0 || validateRange(board) != 0 || validateSatisfy(board) != 0) {
    return 1;
  }

  Sudoku::Board answer;
  int num_answers;
  bool is_exact_num_answer;
  Sudoku::solve(board, answer, num_answers, is_exact_num_answer);
  if (num_answers == 0) {
    std::cout << "No answer" << std::endl;
    return 0;
  }

  if (is_exact_num_answer && num_answers == 1) {
    std::cout << "Unique answer" << std::endl;
  } else if (is_exact_num_answer) {
    std::cout << num_answers << " answers exist" << std::endl;
  } else {
    std::cout << "More than " << (num_answers + 1) << " answers exist" << std::endl;
  }
  for (int i = 0; i < Sudoku::SIZE; i++) {
    for (int j = 0; j < Sudoku::SIZE; j++) {
      std::cout << answer[i][j];
      if (j != Sudoku::SIZE - 1) {
        std::cout << " ";
      }
    }
    std::cout << std::endl;
  }

  return 0;
}