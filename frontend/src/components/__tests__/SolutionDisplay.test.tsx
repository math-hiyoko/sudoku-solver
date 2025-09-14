import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SolutionDisplay } from '../SolutionDisplay';
import { SolverResponse, SudokuBoard } from '../../types';

const createEmptyBoard = (): SudokuBoard => 
  Array(9).fill(null).map(() => Array(9).fill(null));

const mockSingleSolution: SolverResponse = {
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

const mockMultipleSolutions: SolverResponse = {
  solutions: [
    mockSingleSolution.solutions[0],
    {
      solution: [
        [5,1,2,3,4,6,7,8,9],
        [7,8,9,5,1,2,3,4,6],
        [3,4,6,7,8,9,5,1,2],
        [2,5,1,8,3,4,9,6,7],
        [6,9,7,2,5,1,8,3,4],
        [8,3,4,9,6,7,2,5,1],
        [1,2,5,4,7,3,6,9,8],
        [9,6,8,1,2,5,4,7,3],
        [4,7,3,6,9,8,1,2,5]
      ]
    }
  ],
  num_solutions: 2,
  is_exact_num_solutions: true
};

const mockNoSolutions: SolverResponse = {
  solutions: [],
  num_solutions: 0,
  is_exact_num_solutions: true
};

describe('SolutionDisplay', () => {
  test('renders nothing when result is null', () => {
    const { container } = render(<SolutionDisplay result={null} originalBoard={createEmptyBoard()} />);
    expect(container.firstChild).toBeNull();
  });

  test('displays no solutions message when solutions array is empty', () => {
    render(<SolutionDisplay result={mockNoSolutions} originalBoard={createEmptyBoard()} />);
    
    expect(screen.getByText('No solutions found for this Sudoku puzzle.')).toBeInTheDocument();
  });

  test('displays single solution correctly', () => {
    render(<SolutionDisplay result={mockSingleSolution} originalBoard={createEmptyBoard()} />);
    
    expect(screen.getByText('Found 1 solution')).toBeInTheDocument();
    expect(screen.queryByText('Previous')).not.toBeInTheDocument();
    expect(screen.queryByText('Next')).not.toBeInTheDocument();
  });

  test('displays multiple solutions with navigation', () => {
    render(<SolutionDisplay result={mockMultipleSolutions} originalBoard={createEmptyBoard()} />);
    
    expect(screen.getByText('Found 2 solutions')).toBeInTheDocument();
    expect(screen.getByText('Solution 1 of 2 shown')).toBeInTheDocument();
    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  test('navigation buttons work correctly', () => {
    render(<SolutionDisplay result={mockMultipleSolutions} originalBoard={createEmptyBoard()} />);
    
    const nextButton = screen.getByText('Next');
    const previousButton = screen.getByText('Previous');
    
    // Initially on first solution
    expect(screen.getByText('Solution 1 of 2 shown')).toBeInTheDocument();
    expect(previousButton).toBeDisabled();
    expect(nextButton).not.toBeDisabled();
    
    // Click next
    fireEvent.click(nextButton);
    expect(screen.getByText('Solution 2 of 2 shown')).toBeInTheDocument();
    expect(previousButton).not.toBeDisabled();
    expect(nextButton).toBeDisabled();
    
    // Click previous
    fireEvent.click(previousButton);
    expect(screen.getByText('Solution 1 of 2 shown')).toBeInTheDocument();
  });

  test('displays approximate count when not exact', () => {
    const mockApproximate: SolverResponse = {
      ...mockSingleSolution,
      num_solutions: 1000000,
      is_exact_num_solutions: false
    };
    
    render(<SolutionDisplay result={mockApproximate} originalBoard={createEmptyBoard()} />);
    
    expect(screen.getByText('Found 1000000+ solutions (stopped at limit)')).toBeInTheDocument();
  });

  test('passes user inputs correctly to SudokuGrid', () => {
    const originalBoard = createEmptyBoard();
    originalBoard[0][0] = 5;
    originalBoard[1][1] = 3;
    
    render(<SolutionDisplay result={mockSingleSolution} originalBoard={originalBoard} />);
    
    // Should render the grid with solution
    expect(screen.getAllByRole('textbox')).toHaveLength(81);
  });
});