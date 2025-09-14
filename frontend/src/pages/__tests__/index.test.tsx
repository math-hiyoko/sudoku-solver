import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import IndexPage from '../index';
import { solveSudoku } from '../../utils/api';

// Mock the API
jest.mock('../../utils/api');
const mockedSolveSudoku = solveSudoku as jest.MockedFunction<typeof solveSudoku>;

const mockSolutionResponse = {
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

describe('IndexPage', () => {
  beforeEach(() => {
    mockedSolveSudoku.mockClear();
  });

  test('renders page title and subtitle', () => {
    render(<IndexPage />);
    
    expect(screen.getByText('Sudoku Solver')).toBeInTheDocument();
    expect(screen.getByText('Enter your Sudoku puzzle and get instant solutions')).toBeInTheDocument();
  });

  test('renders sudoku grid and control buttons', () => {
    render(<IndexPage />);
    
    // Should render 81 input cells
    expect(screen.getAllByRole('textbox')).toHaveLength(81);
    
    // Should render control buttons
    expect(screen.getByText('Solve Puzzle')).toBeInTheDocument();
    expect(screen.getByText('Clear Board')).toBeInTheDocument();
  });

  test('solve button is disabled when board is empty', () => {
    render(<IndexPage />);
    
    const solveButton = screen.getByText('Solve Puzzle');
    expect(solveButton).toBeDisabled();
  });

  test('solve button is enabled when board has input', () => {
    render(<IndexPage />);
    
    const firstInput = screen.getAllByRole('textbox')[0];
    fireEvent.change(firstInput, { target: { value: '5' } });
    
    const solveButton = screen.getByText('Solve Puzzle');
    expect(solveButton).not.toBeDisabled();
  });

  test('clear board resets the grid and disables solve button', () => {
    render(<IndexPage />);
    
    const firstInput = screen.getAllByRole('textbox')[0] as HTMLInputElement;
    const clearButton = screen.getByText('Clear Board');
    const solveButton = screen.getByText('Solve Puzzle');
    
    // Add some input
    fireEvent.change(firstInput, { target: { value: '5' } });
    expect(firstInput.value).toBe('5');
    expect(solveButton).not.toBeDisabled();
    
    // Clear board
    fireEvent.click(clearButton);
    expect(firstInput.value).toBe('');
    expect(solveButton).toBeDisabled();
  });

  test('shows loading message while solving', async () => {
    mockedSolveSudoku.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve(mockSolutionResponse), 100)));
    
    render(<IndexPage />);
    
    const firstInput = screen.getAllByRole('textbox')[0];
    fireEvent.change(firstInput, { target: { value: '5' } });
    
    const solveButton = screen.getByText('Solve Puzzle');
    fireEvent.click(solveButton);
    
    expect(screen.getByText('Solving your puzzle...')).toBeInTheDocument();
    expect(screen.getByText('Solving...')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.queryByText('Solving your puzzle...')).not.toBeInTheDocument();
    });
  });

  test('displays solution when solve is successful', async () => {
    mockedSolveSudoku.mockResolvedValue(mockSolutionResponse);
    
    render(<IndexPage />);
    
    const firstInput = screen.getAllByRole('textbox')[0];
    fireEvent.change(firstInput, { target: { value: '5' } });
    
    const solveButton = screen.getByText('Solve Puzzle');
    fireEvent.click(solveButton);
    
    await waitFor(() => {
      expect(screen.getByText('Found 1 solution')).toBeInTheDocument();
    });
  });

  test('displays error message when solve fails', async () => {
    mockedSolveSudoku.mockRejectedValue(new Error('Network error'));
    
    render(<IndexPage />);
    
    const firstInput = screen.getAllByRole('textbox')[0];
    fireEvent.change(firstInput, { target: { value: '5' } });
    
    const solveButton = screen.getByText('Solve Puzzle');
    fireEvent.click(solveButton);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to solve the puzzle. Please check your internet connection and try again.')).toBeInTheDocument();
    });
  });

  test('calls API with correct board data', async () => {
    mockedSolveSudoku.mockResolvedValue(mockSolutionResponse);
    
    render(<IndexPage />);
    
    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[0], { target: { value: '5' } });
    fireEvent.change(inputs[10], { target: { value: '3' } });
    
    const solveButton = screen.getByText('Solve Puzzle');
    fireEvent.click(solveButton);
    
    await waitFor(() => {
      expect(mockedSolveSudoku).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.arrayContaining([5, null, null, null, null, null, null, null, null]),
          expect.arrayContaining([null, 3, null, null, null, null, null, null, null])
        ])
      );
    });
  });

  test('buttons are disabled during solving', async () => {
    mockedSolveSudoku.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve(mockSolutionResponse), 100)));
    
    render(<IndexPage />);
    
    const firstInput = screen.getAllByRole('textbox')[0];
    fireEvent.change(firstInput, { target: { value: '5' } });
    
    const solveButton = screen.getByText('Solve Puzzle');
    const clearButton = screen.getByText('Clear Board');
    
    fireEvent.click(solveButton);
    
    expect(solveButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
    
    await waitFor(() => {
      expect(solveButton).not.toBeDisabled();
      expect(clearButton).not.toBeDisabled();
    });
  });
});