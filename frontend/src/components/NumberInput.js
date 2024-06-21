import React from "react";
import styled from "styled-components";

const sudokuDim = parseInt(process.env.SUDOKU_DIM, 10) || 3;
const gridSize = sudokuDim * sudokuDim;

const NumberInputContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const NumberButton = styled.button`
  width: 40px;
  height: 40px;
  font-size: 1.5em;
  margin: 5px;
  cursor: pointer;

  &:hover {
    background-color: #ddd;
  }
`;

const NumberInput = ({ onSelect }) => {
  const numbers = Array.from({ length: gridSize }, (_, i) => i + 1);

  return (
    <NumberInputContainer>
      {numbers.map((number) => (
        <NumberButton key={number} onClick={() => onSelect(number)}>
          {number}
        </NumberButton>
      ))}
    </NumberInputContainer>
  );
};

export default NumberInput;
