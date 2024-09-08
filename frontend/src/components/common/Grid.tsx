import React from "react";
import styled from "styled-components";
import config from "../../config";
import { commonInputStyles, borderStyles } from '../../styles/CommonStyles';

interface CellProps {
  hasError: boolean;
  color?: string;
  index: number;
}

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(${config.gridSize}, 1fr);
  grid-template-rows: repeat(${config.gridSize}, 1fr);
  border: 2px solid black;
  gap: 0;
  aspect-ratio: 1;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
`;

const Cell = styled.input<CellProps>`
  width: 100%;
  height: 100%;
  background-color: ${({ hasError }) => (hasError ? 'lightcoral' : 'white')};
  color: ${({ color }) => color ?? 'black'};
  ${commonInputStyles}
  ${({ index }) => borderStyles({ index })}  // ここでpropsを渡す
`;

interface GridProps {
  board: (number | undefined)[];
  onCellClick?: (index: number) => void;
  errorDetails?: number[];
  cellColors?: string[];
}

const Grid: React.FC<GridProps> = ({
  board,
  onCellClick = () => {},
  errorDetails = [],
  cellColors = [],
}) => {
  return (
    <GridContainer>
      {board.map((cell, index) => (
        <Cell
          key={index}
          value={cell !== undefined ? cell.toString() : ""}
          index={index}
          onClick={() => onCellClick(index)}
          readOnly
          hasError={errorDetails.includes(index)}
          color={cellColors[index]}
        />
      ))}
    </GridContainer>
  );
};

export default Grid;
