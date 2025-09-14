import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { SudokuGrid } from '../components/SudokuGrid';
import { SolutionDisplay } from '../components/SolutionDisplay';
import { solveSudoku, SudokuConstraintError } from '../utils/api';
import { validateSudokuBoard, getAllConflictingCells } from '../utils/sudokuValidator';
import { convertBackendErrorsToFrontend, formatBackendErrorMessage } from '../utils/backendValidator';
import { SudokuBoard, SolverResponse } from '../types';
import '../styles/global.css';

const Container = styled.div`
  min-height: 100vh;
  padding: 20px;
  background-color: #f5f5f5;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 40px;
`;

const Title = styled.h1`
  color: #333;
  font-size: 2.5rem;
  margin-bottom: 10px;
`;

const Subtitle = styled.p`
  color: #666;
  font-size: 1.1rem;
  margin: 0;
`;

const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
`;

const Controls = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 30px 0;
`;

const Button = styled.button`
  padding: 12px 24px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  
  &:hover {
    background-color: #0056b3;
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const ClearButton = styled(Button)`
  background-color: #6c757d;
  
  &:hover {
    background-color: #545b62;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  font-size: 18px;
  color: #007bff;
  margin: 40px 0;
`;

const ErrorMessage = styled.div`
  text-align: center;
  font-size: 18px;
  color: #d32f2f;
  margin: 40px 0;
  padding: 20px;
  background-color: #ffebee;
  border-radius: 5px;
  border: 1px solid #ffcdd2;
`;

const ValidationMessage = styled.div`
  text-align: center;
  font-size: 16px;
  color: #d32f2f;
  margin: 20px 0;
  padding: 15px;
  background-color: #fff3e0;
  border-radius: 5px;
  border: 1px solid #ffcc02;
`;

const createEmptyBoard = (): SudokuBoard => 
  Array(9).fill(null).map(() => Array(9).fill(null));

const IndexPage: React.FC = () => {
  const [board, setBoard] = useState<SudokuBoard>(createEmptyBoard());
  const [originalBoard, setOriginalBoard] = useState<SudokuBoard>(createEmptyBoard());
  const [result, setResult] = useState<SolverResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Set<string>>(new Set());
  const [validationMessage, setValidationMessage] = useState<string>('');
  const [backendValidationErrors, setBackendValidationErrors] = useState<Set<string>>(new Set());

  const handleCellChange = (row: number, col: number, value: number | null) => {
    const newBoard = board.map((boardRow, rowIndex) =>
      boardRow.map((cell, colIndex) =>
        rowIndex === row && colIndex === col ? value : cell
      )
    );
    const newOriginalBoard = originalBoard.map((boardRow, rowIndex) =>
      boardRow.map((cell, colIndex) =>
        rowIndex === row && colIndex === col ? value : cell
      )
    );
    setBoard(newBoard);
    setOriginalBoard(newOriginalBoard);
    setResult(null);
    setError(null);
    setBackendValidationErrors(new Set()); // Clear backend validation errors when user makes changes
  };

  // Validate board whenever it changes
  useEffect(() => {
    const validation = validateSudokuBoard(board);
    const errorCells = getAllConflictingCells(validation);
    
    setValidationErrors(errorCells);
    
    if (!validation.isValid) {
      const conflictCount = validation.conflicts.length;
      setValidationMessage(`Found ${conflictCount} conflict${conflictCount === 1 ? '' : 's'} in the puzzle. Check highlighted cells.`);
    } else {
      setValidationMessage('');
    }
  }, [board]);

  const handleSolve = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    setBackendValidationErrors(new Set());

    try {
      const response = await solveSudoku(board);
      setResult(response);
    } catch (err) {
      if (err instanceof SudokuConstraintError) {
        // Handle backend constraint violation
        const backendErrors = convertBackendErrorsToFrontend(err.details);
        const errorMessage = formatBackendErrorMessage(err.details);
        
        setBackendValidationErrors(backendErrors);
        setError(`Backend validation failed: ${errorMessage}`);
      } else {
        setError('Failed to solve the puzzle. Please check your internet connection and try again.');
      }
      console.error('Solve error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setBoard(createEmptyBoard());
    setOriginalBoard(createEmptyBoard());
    setResult(null);
    setError(null);
    setValidationErrors(new Set());
    setValidationMessage('');
    setBackendValidationErrors(new Set());
  };

  const hasInput = board.some(row => row.some(cell => cell !== null));

  return (
    <Container>
      <Header>
        <Title>Sudoku Solver</Title>
        <Subtitle>Enter your Sudoku puzzle and get instant solutions</Subtitle>
      </Header>
      
      <MainContent>
        <SudokuGrid 
          board={board} 
          onCellChange={handleCellChange}
          errorCells={new Set([...validationErrors, ...backendValidationErrors])}
        />
        
        {validationMessage && (
          <ValidationMessage>
            {validationMessage}
          </ValidationMessage>
        )}
        
        <Controls>
          <Button 
            onClick={handleSolve} 
            disabled={loading || !hasInput || validationErrors.size > 0}
          >
            {loading ? 'Solving...' : 'Solve Puzzle'}
          </Button>
          <ClearButton onClick={handleClear} disabled={loading}>
            Clear Board
          </ClearButton>
        </Controls>

        {loading && (
          <LoadingMessage>
            Solving your puzzle...
          </LoadingMessage>
        )}

        {error && (
          <ErrorMessage>
            {error}
          </ErrorMessage>
        )}

        <SolutionDisplay result={result} originalBoard={originalBoard} />
      </MainContent>
    </Container>
  );
};

export default IndexPage;