#include <iostream>

#include "SudokuSolver.hpp"


int main() {
    const SudokuBoard input = SudokuBoard{
        std::array<int, 9>{6, 0, 0, 0, 2, 0, 0, 0, 8},
        {0, 0, 0, 1, 0, 6, 0, 9, 0},
        {0, 9, 0, 0, 3, 0, 0, 2, 0},
        {0, 0, 0, 7, 0, 2, 3, 6, 0},
        {2, 0, 6, 0, 0, 0, 0, 0, 0},
        {0, 3, 0, 0, 8, 0, 0, 4, 9},
        {0, 0, 5, 0, 0, 0, 0, 0, 0},
        {0, 0, 0, 0, 0, 0, 0, 0, 0},
        {0, 0, 0, 0, 0, 0, 0, 0, 0}
    };
    int num_answer = 0;
    SudokuBoard output;
    solveSudoku(input, num_answer, output);
    std::cout << "num_answer: " << num_answer << std::endl;
    for (int i = 0; i < SUDOKU_SIZE; i++) {
        for (int j = 0; j < SUDOKU_SIZE; j++) {
            std::cout << output[i][j] << " ";
        }
        std::cout << std::endl;
    }
    return 0;
}