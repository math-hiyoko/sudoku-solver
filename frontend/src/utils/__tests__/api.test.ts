import { solveSudoku, SudokuConstraintError } from '../api';
import { SudokuBoard } from '../../types';

// Mock fetch globally
global.fetch = jest.fn();

const createEmptyBoard = (): SudokuBoard => 
  Array(9).fill(null).map(() => Array(9).fill(null));

const mockSuccessResponse = {
  solutions: [{
    solution: [
      [5,1,2,3,4,6,7,8,9],
      [7,8,9,5,1,2,3,4,6],
      [3,4,6,7,8,9,5,1,2],
      [2,5,1,8,3,4,9,6,7],
      [6,9,7,2,5,1,8,3,4],
      [8,3,4,6,9,7,2,5,1],
      [1,2,5,4,7,3,6,9,8],
      [9,6,8,1,2,5,4,7,3],
      [4,7,3,9,6,8,1,2,5]
    ]
  }],
  num_solutions: 1,
  is_exact_num_solutions: true
};

describe('solveSudoku API', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  test('makes correct API request', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue(mockSuccessResponse)
    };
    (fetch as jest.Mock).mockResolvedValue(mockResponse);

    const board = createEmptyBoard();
    await solveSudoku(board);

    expect(fetch).toHaveBeenCalledWith(
      'https://4cubkquqti.execute-api.ap-northeast-1.amazonaws.com/solve-sudoku',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ board }),
      }
    );
  });

  test('returns solver response on success', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue(mockSuccessResponse)
    };
    (fetch as jest.Mock).mockResolvedValue(mockResponse);

    const board = createEmptyBoard();
    const result = await solveSudoku(board);

    expect(result).toEqual(mockSuccessResponse);
  });

  test('throws SudokuConstraintError for backend validation errors', async () => {
    const mockErrorResponse = {
      error: {
        type: 'ConstraintViolation',
        message: 'Input does not meet the required constraints.',
        detail: [
          { row: 8, column: 7, number: 1 },
          { row: 8, column: 8, number: 1 }
        ]
      }
    };

    const mockResponse = {
      ok: false,
      status: 400,
      json: jest.fn().mockResolvedValue(mockErrorResponse)
    };
    (fetch as jest.Mock).mockResolvedValue(mockResponse);

    const board = createEmptyBoard();
    
    try {
      await solveSudoku(board);
      fail('Expected SudokuConstraintError to be thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(SudokuConstraintError);
      expect(error.message).toBe('Input does not meet the required constraints.');
      expect(error.details).toEqual([
        { row: 8, column: 7, number: 1 },
        { row: 8, column: 8, number: 1 }
      ]);
    }
  });

  test('throws generic error for non-constraint API errors', async () => {
    const mockResponse = {
      ok: false,
      status: 500,
      json: jest.fn().mockResolvedValue({ error: { type: 'ServerError', message: 'Internal error' } })
    };
    (fetch as jest.Mock).mockResolvedValue(mockResponse);

    const board = createEmptyBoard();
    
    await expect(solveSudoku(board)).rejects.toThrow('HTTP error! status: 500');
  });

  test('throws error when fetch fails', async () => {
    const errorMessage = 'Network error';
    (fetch as jest.Mock).mockRejectedValue(new Error(errorMessage));

    const board = createEmptyBoard();
    
    await expect(solveSudoku(board)).rejects.toThrow(errorMessage);
  });

  test('sends correct board format', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue(mockSuccessResponse)
    };
    (fetch as jest.Mock).mockResolvedValue(mockResponse);

    const board = createEmptyBoard();
    board[0][0] = 5;
    board[1][1] = 3;
    
    await solveSudoku(board);

    const sentData = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body);
    expect(sentData.board).toEqual(board);
    expect(sentData.board[0][0]).toBe(5);
    expect(sentData.board[1][1]).toBe(3);
    expect(sentData.board[0][1]).toBeNull();
  });
});