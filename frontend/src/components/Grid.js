import React from 'react';
import styled from 'styled-components';

const sudokuDim = parseInt(process.env.SUDOKU_DIM, 10) || 3;
const gridSize = sudokuDim * sudokuDim;


let gridStyles = `
  & > input {
    box-sizing: border-box;
    border: 1px solid #ccc; /* 通常のセル境界線 */
    width: 100%;
    height: 0;
    padding-bottom: 100%;
    display: block;
  }
  
  /* 大きなグリッドの境界線を追加 */
  & > input:nth-child(${sudokuDim}n) { /* 各ブロックの左側の境界を太く */
    border-right: 2px solid black;
  }
  
  & > input:nth-child(${sudokuDim}n+1) { /* 各ブロックの右側の境界を太く */
    border-left: 2px solid black;
  }
`;

for (let i = 0; i < sudokuDim; i++) {
  gridStyles += `
    & > input:nth-child(n+${gridSize * sudokuDim * i + 1}):nth-child(-n+${gridSize * sudokuDim * i + gridSize}) { /* 各ブロックの上側の境界を太く */
      border-top: 2px solid black;
    }
    
    & > input:nth-child(n+${gridSize * sudokuDim * (i + 1) - gridSize + 1}):nth-child(-n+${gridSize * sudokuDim * (i + 1)}) { /* 各ブロックの下側の境界を太く */
      border-bottom: 2px solid black;
    }
  `;
}

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(${gridSize}, 1fr);
  grid-template-rows: repeat(${gridSize}, 1fr);
  gap: 0; /* セル間のギャップを削除 */

  ${gridStyles}
`;

const Cell = styled.input`
  width: 100%;
  height: 100%;
  text-align: center;
  font-size: 1.5em;

  @media (max-width: 600px) {
    font-size: 1em;
  }
  
  &::before {
    content: "";
    display: block;
    padding-bottom: 100%; /* 正方形を維持 */
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
