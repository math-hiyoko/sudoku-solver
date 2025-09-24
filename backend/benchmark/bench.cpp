#include <benchmark/benchmark.h>

#include <algorithm>
#include <string>
#include <vector>

#include "solver/SudokuSolver.hpp"
#include "solver/SudokuType.hpp"

static const Sudoku::Board Board9x9_Easy = {{
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

static const Sudoku::Board Board9x9_Hard = {{
    {8, 0, 0, 0, 0, 0, 0, 0, 3},
    {0, 0, 3, 6, 0, 0, 0, 0, 0},
    {0, 7, 0, 0, 9, 0, 2, 0, 0},
    {0, 0, 0, 0, 0, 7, 0, 0, 0},
    {0, 0, 0, 0, 0, 5, 7, 0, 0},
    {0, 0, 0, 1, 0, 0, 0, 0, 0},
    {0, 0, 1, 0, 0, 0, 0, 6, 8},
    {0, 0, 0, 0, 0, 0, 0, 1, 0},
    {0, 9, 0, 0, 0, 0, 4, 0, 0},
}};

static void BM_SudokuSolve(benchmark::State& state, const Sudoku::Board* board) {
  for (auto _ : state) {
    std::vector<Sudoku::Board> solutions;
    int num_solutions;
    bool is_exact_num_solutions;

    benchmark::DoNotOptimize(board);
    Sudoku::solve(*board, solutions, num_solutions, is_exact_num_solutions);
    benchmark::DoNotOptimize(solutions.size());
    benchmark::DoNotOptimize(num_solutions);
    benchmark::DoNotOptimize(is_exact_num_solutions);
    benchmark::ClobberMemory();
  }
}

BENCHMARK_CAPTURE(BM_SudokuSolve, Easy, &Board9x9_Easy)
    ->Unit(benchmark::kMillisecond)
    ->Repetitions(20)
    ->ReportAggregatesOnly(true);

BENCHMARK_CAPTURE(BM_SudokuSolve, Hard, &Board9x9_Hard)
    ->Unit(benchmark::kMillisecond)
    ->Repetitions(20)
    ->ReportAggregatesOnly(true);
