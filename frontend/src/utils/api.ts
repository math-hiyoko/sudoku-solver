import { SolverRequest, SolverResponse, BackendErrorResponse } from '../types';

const API_ENDPOINT = 'https://4cubkquqti.execute-api.ap-northeast-1.amazonaws.com/solve-sudoku';

export class SudokuConstraintError extends Error {
  public details: Array<{ row: number; column: number; number: number }>;
  
  constructor(message: string, details: Array<{ row: number; column: number; number: number }>) {
    super(message);
    this.name = 'SudokuConstraintError';
    this.details = details;
  }
}

export const solveSudoku = async (board: SolverRequest['board']): Promise<SolverResponse> => {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ board }),
    });

    if (!response.ok) {
      const errorData: BackendErrorResponse = await response.json();
      
      if (errorData.error && errorData.error.type === 'ConstraintViolation') {
        throw new SudokuConstraintError(errorData.error.message, errorData.error.detail);
      }
      
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: SolverResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error solving sudoku:', error);
    throw error;
  }
};