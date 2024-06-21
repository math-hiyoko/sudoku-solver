import React from "react";
import styled from "styled-components";

const sudokuDim = parseInt(process.env.SUDOKU_DIM, 10) || 3;
const gridSize = sudokuDim * sudokuDim;

let inputStyles = `
  & > input {
    box-sizing: border-box;
    border: 1px solid #ccc; /* 通常のセル境界線 */
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    display: block;
    font-size: 2em;
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
  inputStyles += `
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
  border: 2px solid black;
  gap: 0; /* セル間のギャップを削除 */

  ${inputStyles}
`;

const Cell = styled.input`
  width: 100%;
  height: 100%;
  text-align: center;
  border: none;
`;

const Grid = ({ board, setBoard, onCellClick }) => {
  const handleCellClick = (index) => {
    onCellClick(index); // セルクリック時のハンドラー呼び出し
  };

  return (
    <GridContainer>
      {board.map((cell, index) => (
        <Cell
          key={index}
          value={cell}
          onClick={() => handleCellClick(index)} // セルクリック対応
          maxLength="1"
          readOnly // セルに直接入力できないようにする
        />
      ))}
    </GridContainer>
  );
};

export default Grid;
