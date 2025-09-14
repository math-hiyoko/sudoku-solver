import React from 'react';
import styled from 'styled-components';
import { SudokuBoard, SudokuCell } from '../types';

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(9, 50px);
  grid-template-rows: repeat(9, 50px);
  gap: 1px;
  border: 3px solid #333;
  background-color: #333;
  margin: 20px auto;
  width: fit-content;
`;

const Cell = styled.input.withConfig({
  shouldForwardProp: (prop) => !['isUserInput', 'hasError'].includes(prop),
})<{ isUserInput: boolean; hasError: boolean }>`
  width: 50px;
  height: 50px;
  border: none;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  background-color: ${props => {
    if (props.hasError) return '#ffebee';
    return props.isUserInput ? '#fff' : '#f0f0f0';
  }};
  color: ${props => {
    if (props.hasError) return '#d32f2f';
    return props.isUserInput ? '#000' : '#007bff';
  }};
  border: ${props => props.hasError ? '2px solid #d32f2f' : 'none'};
  
  &:focus {
    outline: 2px solid #007bff;
    background-color: #e7f3ff;
  }
  
  &:nth-child(3n) {
    border-right: 2px solid #333;
  }
  
  &:nth-child(n+19):nth-child(-n+27),
  &:nth-child(n+46):nth-child(-n+54) {
    border-bottom: 2px solid #333;
  }
`;

interface SudokuGridProps {
  board: SudokuBoard;
  onCellChange: (row: number, col: number, value: SudokuCell) => void;
  readOnly?: boolean;
  userInputs?: boolean[][];
  errorCells?: Set<string>;
}

export const SudokuGrid: React.FC<SudokuGridProps> = ({ 
  board, 
  onCellChange, 
  readOnly = false,
  userInputs,
  errorCells = new Set()
}) => {
  const handleInputChange = (row: number, col: number, value: string) => {
    if (readOnly) return;
    
    const numValue = value === '' ? null : parseInt(value);
    if (value !== '' && (isNaN(numValue!) || numValue! < 1 || numValue! > 9)) {
      return;
    }
    
    onCellChange(row, col, numValue);
  };

  return (
    <GridContainer>
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const cellKey = `${rowIndex}-${colIndex}`;
          const hasError = errorCells.has(cellKey);
          
          return (
            <Cell
              key={cellKey}
              type="text"
              value={cell || ''}
              onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)}
              maxLength={1}
              readOnly={readOnly}
              isUserInput={userInputs ? userInputs[rowIndex][colIndex] : true}
              hasError={hasError}
              data-user-input={userInputs ? userInputs[rowIndex][colIndex] : true}
              title={hasError ? 'This cell conflicts with Sudoku rules' : ''}
            />
          );
        })
      )}
    </GridContainer>
  );
};