#include <algorithm>
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
  std::vector<Sudoku::Option> options;
  int num_invalid = Sudoku::isSatisfy(board, options);
  if (num_invalid != 0) {
    std::cerr << "Invalid options" << std::endl;
    for (const Sudoku::Option option : options) {
      std::cerr << "Invalid value: " << option.number << " at (" << option.row << ", "
                << option.column << ")" << std::endl;
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

  std::vector<Sudoku::Board> solutions;
  int num_solutions;
  bool is_exact_num_solutions;
  Sudoku::solve(board, solutions, num_solutions, is_exact_num_solutions);
  if (num_solutions == 0) {
    std::cout << "No solution" << std::endl;
    return 0;
  }

  if (is_exact_num_solutions && num_solutions == 1) {
    std::cout << "Unique solution exists" << std::endl;
  } else if (is_exact_num_solutions) {
    std::cout << num_solutions << " solutions exist" << std::endl;
  } else {
    std::cout << "No less than " << num_solutions << " solutions exist" << std::endl;
  }

  solutions.resize(std::min(3, static_cast<int>(solutions.size())));
  for (Sudoku::Board& solution : solutions) {
    std::cout << "Solution:" << std::endl;
    for (int i = 0; i < Sudoku::SIZE; i++) {
      for (int j = 0; j < Sudoku::SIZE; j++) {
        std::cout << solution[i][j];
        if (j != Sudoku::SIZE - 1) {
          std::cout << (j % Sudoku::LEVEL == Sudoku::LEVEL - 1 ? " | " : " ");
        }
      }
      if (i != Sudoku::SIZE - 1 && i % Sudoku::LEVEL == Sudoku::LEVEL - 1) {
        std::cout << std::endl << std::string(Sudoku::SIZE * 2 + Sudoku::LEVEL, '-');
      }
      std::cout << std::endl;
    }
  }

  return 0;
}