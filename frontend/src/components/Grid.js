import React from "react";
import styled from "styled-components";

const sudokuDim = parseInt(process.env.SUDOKU_DIM, 10) || 3;
const gridSize = sudokuDim * sudokuDim;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(${gridSize}, 1fr);
  grid-template-rows: repeat(${gridSize}, 1fr);
  border: 2px solid black;
  gap: 0;
  aspect-ratio: 1;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
`;

const Cell = styled.input`
  width: 100%;
  height: 100%;
  text-align: center;
  border: 1px solid black;
  box-sizing: border-box;
  font-size: 2em;
  background-color: ${({ hasError }) => (hasError ? "lightcoral" : "white")};
  color: ${({ hasError }) => (hasError ? "white" : "black")};
  ${({ index }) =>
    index % sudokuDim === sudokuDim - 1 ? `border-right: 2px solid black;` : ""}
  ${({ index }) =>
    index % sudokuDim === 0 ? `border-left: 2px solid black;` : ""}
  ${({ index }) =>
    Math.floor(index / gridSize) % sudokuDim === 0
      ? `border-top: 2px solid black;`
      : ""}
  ${({ index }) =>
    Math.floor(index / gridSize) % sudokuDim === sudokuDim - 1
      ? `border-bottom: 2px solid black;`
      : ""}
`;

const Grid = ({ board, setBoard, onCellClick, errorDetails }) => {
  return (
    <GridContainer>
      {board.map((cell, index) => (
        <Cell
          key={index}
          value={cell}
          index={index}
          onClick={() => onCellClick(index)}
          maxLength="1"
          readOnly
          hasError={errorDetails.includes(index)}
        />
      ))}
    </GridContainer>
  );
};

export default Grid;
