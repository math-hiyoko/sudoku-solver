import React, { useState } from "react";
import styled from "styled-components";
import config from "../../config";

interface ButtonProps {
  isSelected: boolean;
}

const NumberInputContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  flex-wrap: wrap; /* 数字ボタンが一列に収まらない場合に折り返す */
`;

const NumberButton = styled.button.withConfig({
  shouldForwardProp: (prop) => !['isSelected'].includes(prop),
})<ButtonProps>`
  width: 40px;
  height: 40px;
  font-size: 1.5em;
  margin: 5px;
  cursor: pointer;
  background-color: ${({ isSelected }) => (isSelected ? "#ddd" : "white")};
  border: ${({ isSelected }) =>
    isSelected ? "2px solid black" : "1px solid #ccc"};
  box-sizing: border-box;

  &:hover {
    background-color: #ddd;
  }
`;

const DeleteButton = styled(NumberButton)`
  width: 80px;
  font-size: 1.2em;
`;

interface NumberInputProps {
  onSelect: (number: number | "delete" | undefined) => void;
}

const NumberInput: React.FC<NumberInputProps> = ({ onSelect }) => {
  const [selectedNumber, setSelectedNumber] = useState<
    number | "delete" | undefined
  >();

  const handleNumberClick = (number: number) => {
    const newNumber: number | undefined =
      selectedNumber === number ? undefined : number;
    setSelectedNumber(newNumber);
    onSelect(newNumber);
  };

  const handleClear = () => {
    const newNumber: "delete" | undefined =
      selectedNumber === "delete" ? undefined : "delete";
    setSelectedNumber(newNumber);
    onSelect(newNumber);
  };

  const numbers: number[] = Array.from(
    { length: config.gridSize },
    (_, i) => i + 1,
  );

  return (
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
  );
};

export default NumberInput;
