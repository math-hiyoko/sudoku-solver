import React from 'react';
import styled from 'styled-components';

const sudokuDim = parseInt(process.env.SUDOKU_DIM, 10) || 3;
const gridSize = sudokuDim * sudokuDim;


const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(${gridSize}, 1fr);
  gap: 5px;

  @media (max-width: 600px) {
    gap: 2px;
  }
`;

const Cell = styled.input`
  width: 40px;
  height: 40px;
  text-align: center;
  font-size: 1.5em;

  @media (max-width: 600px) {
    width: 30px;
    height: 30px;
    font-size: 1em;
  }
`;

const Grid = ({ board, setBoard }) => {
  const handleInputChange = (index, value) => {
    const newBoard = [...board];
    newBoard[index] = value;
    setBoard(newBoard);
  };

  return (
    <GridContainer>
      {board.map((cell, index) => (
        <Cell
          key={index}
          value={cell}
          onChange={(e) => handleInputChange(index, e.target.value)}
          maxLength="1"
        />
      ))}
    </GridContainer>
  );
};

export default Grid;
