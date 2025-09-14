export type SudokuCell = number | null;
export type SudokuBoard = SudokuCell[][];

export interface SudokuSolution {
  solution: number[][];
}

export interface SolverResponse {
  solutions: SudokuSolution[];
  num_solutions: number;
  is_exact_num_solutions: boolean;
}

export interface SolverRequest {
  board: SudokuBoard;
}

export interface BackendErrorDetail {
  row: number;
  column: number;
  number: number;
}

export interface BackendError {
  type: string;
  message: string;
  detail: BackendErrorDetail[];
}

export interface BackendErrorResponse {
  error: BackendError;
}