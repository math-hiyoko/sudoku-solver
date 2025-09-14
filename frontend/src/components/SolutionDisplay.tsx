import React, { useState } from 'react';
import styled from 'styled-components';
import { SolverResponse, SudokuBoard } from '../types';
import { SudokuGrid } from './SudokuGrid';

const Container = styled.div`
  margin: 20px auto;
  max-width: 800px;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 20px;
`;

const SolutionCount = styled.h3`
  color: #333;
  margin-bottom: 10px;
`;

const NavigationControls = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin: 20px 0;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  
  &:hover {
    background-color: #0056b3;
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const SolutionInfo = styled.div`
  text-align: center;
  font-size: 18px;
  color: #555;
`;

const NoSolutionsMessage = styled.div`
  text-align: center;
  font-size: 18px;
  color: #d32f2f;
  margin: 40px 0;
`;

interface SolutionDisplayProps {
  result: SolverResponse | null;
  originalBoard: SudokuBoard;
}

export const SolutionDisplay: React.FC<SolutionDisplayProps> = ({ result, originalBoard }) => {
  const [currentSolutionIndex, setCurrentSolutionIndex] = useState(0);

  if (!result) {
    return null;
  }

  if (result.solutions.length === 0) {
    return (
      <Container>
        <NoSolutionsMessage>
          No solutions found for this Sudoku puzzle.
        </NoSolutionsMessage>
      </Container>
    );
  }

  const currentSolution = result.solutions[currentSolutionIndex];

  const createUserInputsMap = () => {
    return originalBoard.map(row => 
      row.map(cell => cell !== null)
    );
  };

  const handlePrevious = () => {
    setCurrentSolutionIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentSolutionIndex(prev => Math.min(result.solutions.length - 1, prev + 1));
  };

  return (
    <Container>
      <Header>
        <SolutionCount>
          {result.is_exact_num_solutions 
            ? `Found ${result.num_solutions} solution${result.num_solutions === 1 ? '' : 's'}`
            : `Found ${result.num_solutions}+ solutions (stopped at limit)`
          }
        </SolutionCount>
        
        {result.solutions.length > 1 && (
          <>
            <SolutionInfo>
              Solution {currentSolutionIndex + 1} of {result.solutions.length} shown
            </SolutionInfo>
            <NavigationControls>
              <Button 
                onClick={handlePrevious} 
                disabled={currentSolutionIndex === 0}
              >
                Previous
              </Button>
              <Button 
                onClick={handleNext} 
                disabled={currentSolutionIndex === result.solutions.length - 1}
              >
                Next
              </Button>
            </NavigationControls>
          </>
        )}
      </Header>
      
      <SudokuGrid 
        board={currentSolution.solution} 
        onCellChange={() => {}} 
        readOnly={true}
        userInputs={createUserInputsMap()}
      />
    </Container>
  );
};