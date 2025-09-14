import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SudokuGrid } from '../SudokuGrid';
import { SudokuBoard } from '../../types';

const createEmptyBoard = (): SudokuBoard => 
  Array(9).fill(null).map(() => Array(9).fill(null));

const createPartialBoard = (): SudokuBoard => {
  const board = createEmptyBoard();
  board[0][0] = 5;
  board[0][1] = 3;
  board[1][0] = 6;
  return board;
};

const mockOnCellChange = jest.fn();

describe('SudokuGrid', () => {
  beforeEach(() => {
    mockOnCellChange.mockClear();
  });

  test('renders 81 input cells', () => {
    render(<SudokuGrid board={createEmptyBoard()} onCellChange={mockOnCellChange} />);
    
    const inputs = screen.getAllByRole('textbox');
    expect(inputs).toHaveLength(81);
  });

  test('displays initial board values correctly', () => {
    const board = createPartialBoard();
    render(<SudokuGrid board={board} onCellChange={mockOnCellChange} />);
    
    const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
    expect(inputs[0].value).toBe('5');
    expect(inputs[1].value).toBe('3');
    expect(inputs[9].value).toBe('6');
    expect(inputs[2].value).toBe('');
  });

  test('calls onCellChange when user inputs valid number', () => {
    render(<SudokuGrid board={createEmptyBoard()} onCellChange={mockOnCellChange} />);
    
    const firstInput = screen.getAllByRole('textbox')[0];
    fireEvent.change(firstInput, { target: { value: '7' } });
    
    expect(mockOnCellChange).toHaveBeenCalledWith(0, 0, 7);
  });

  test('calls onCellChange with null when user clears cell', () => {
    const board = createPartialBoard();
    render(<SudokuGrid board={board} onCellChange={mockOnCellChange} />);
    
    const firstInput = screen.getAllByRole('textbox')[0];
    fireEvent.change(firstInput, { target: { value: '' } });
    
    expect(mockOnCellChange).toHaveBeenCalledWith(0, 0, null);
  });

  test('ignores invalid input', () => {
    render(<SudokuGrid board={createEmptyBoard()} onCellChange={mockOnCellChange} />);
    
    const firstInput = screen.getAllByRole('textbox')[0];
    fireEvent.change(firstInput, { target: { value: '0' } });
    fireEvent.change(firstInput, { target: { value: '10' } });
    fireEvent.change(firstInput, { target: { value: 'a' } });
    
    expect(mockOnCellChange).not.toHaveBeenCalled();
  });

  test('does not call onCellChange when readOnly is true', () => {
    render(<SudokuGrid board={createEmptyBoard()} onCellChange={mockOnCellChange} readOnly={true} />);
    
    const firstInput = screen.getAllByRole('textbox')[0];
    fireEvent.change(firstInput, { target: { value: '5' } });
    
    expect(mockOnCellChange).not.toHaveBeenCalled();
  });

  test('applies correct styling based on userInputs prop', () => {
    const board = createPartialBoard();
    const userInputs = Array(9).fill(null).map(() => Array(9).fill(false));
    userInputs[0][0] = true; // First cell is user input

    render(
      <SudokuGrid 
        board={board} 
        onCellChange={mockOnCellChange} 
        userInputs={userInputs}
        readOnly={true}
      />
    );
    
    const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
    
    // First cell should be marked as user input
    expect(inputs[0]).toHaveAttribute('data-user-input', 'true');
    // Second cell should not be marked as user input
    expect(inputs[1]).toHaveAttribute('data-user-input', 'false');
  });
});