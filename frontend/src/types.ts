export interface SolveSudokuResponse {
  solution: number[][];
  num_solutions: number;
  is_exact_num_solutions: boolean;
}
