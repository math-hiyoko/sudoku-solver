import styled, { css } from "styled-components";
import config from "../config";

export const commonInputStyles = css`
  text-align: center;
  border: 1px solid black;
  box-sizing: border-box;
  font-size: 2em;
`;

type BorderStyleProps = {
  index: number;
};

export const borderStyles = ({ index }: BorderStyleProps) => css`
  ${index % config.sudokuDim === config.sudokuDim - 1 ? 'border-right: 2px solid black;' : ''}
  ${index % config.sudokuDim === 0 ? 'border-left: 2px solid black;' : ''}
  ${Math.floor(index / config.gridSize) % config.sudokuDim === 0 ? 'border-top: 2px solid black;' : ''}
  ${Math.floor(index / config.gridSize) % config.sudokuDim === config.sudokuDim - 1 ? 'border-bottom: 2px solid black;' : ''}
`;

export const Button = styled.button`
  padding: 10px 20px;
  font-size: 1em;
  margin: 5px;
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
`;

export const Container = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  p {
    margin: 4px 0; /* 段落間の間隔を小さくする */
    line-height: 1.2; /* 行の高さを少し縮小 */
  }
`;

export const Content = styled.div`
  flex: 1;
`;

export const ErrorMessage = styled.div`
  color: red;
  margin-top: 20px;
`;
