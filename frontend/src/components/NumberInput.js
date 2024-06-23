import React, { useState } from "react";
import styled from "styled-components";

const sudokuDim = parseInt(process.env.SUDOKU_DIM, 10) || 3;
const gridSize = sudokuDim * sudokuDim;

const NumberInputContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  flex-wrap: wrap; /* 数字ボタンが一列に収まらない場合に折り返す */
`;

const NumberButton = styled.button`
  width: 40px;
  height: 40px;
  font-size: 1.5em;
  margin: 5px;
  cursor: pointer;
  background-color: ${({ isSelected }) => (isSelected ? "#ddd" : "white")};
  border: ${({ isSelected }) => (isSelected ? "2px solid black" : "1px solid #ccc")};
  box-sizing: border-box;

  &:hover {
    background-color: #ddd;
  }
`;

const DeleteButton = styled(NumberButton)`
  width: 80px;
  font-size: 1.2em;
`;

const NumberInput = ({ onSelect }) => {
  const [selectedNumber, setSelectedNumber] = useState(undefined);

  const handleNumberClick = (number) => {
    if (selectedNumber === number) {
      setSelectedNumber(undefined);
      onSelect(undefined);
    } else {
      setSelectedNumber(number);
      onSelect(number);
    }
  };

  const handleClear = () => {
    if (selectedNumber === "delete") {
      setSelectedNumber(undefined);
      onSelect(undefined);
    } else {
      setSelectedNumber("delete");
      onSelect("delete");
    }
  };

  const numbers = Array.from({ length: gridSize }, (_, i) => i + 1);

  return (
    <div>
      <NumberInputContainer>
        {numbers.map((number) => (
          <NumberButton
            key={number}
            onClick={() => handleNumberClick(number)}
            isSelected={selectedNumber === number}
          >
            {number}
          </NumberButton>
        ))}
        <DeleteButton
          onClick={handleClear}
          isSelected={selectedNumber === "delete"}
        >
          削除
        </DeleteButton>
      </NumberInputContainer>
    </div>
  );
};

export default NumberInput;
