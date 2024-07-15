import React from "react";
import { Link } from "gatsby";
import Grid from "../components/Grid";
import { Container } from "../styles/CommonStyles";

const sudokuDim = parseInt(process.env.SUDOKU_DIM, 10) || 3;
const gridSize = sudokuDim * sudokuDim;

const ResultPage = ({ location }) => {
  const { solution, numSolutions, isExactNumSolutions, userBoard } =
    location.state || {};

  if (
    !solution ||
    numSolutions === null ||
    !isExactNumSolutions === null ||
    !userBoard
  ) {
    return <p>Loading...</p>;
  }
  console.log(solution);

  const board = [];
  const cellColors = Array(gridSize * gridSize).fill("black");
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const index = i * gridSize + j;
      board.push(solution[i][j]);
      if (userBoard[index] === undefined) {
        cellColors[index] = "blue";
      }
    }
  }

  return (
    <Container>
      <h1>Sudoku Solution</h1>
      <p>Number of Solutions: {numSolutions}</p>
      <p>Is Exact Number of Solutions: {isExactNumSolutions ? "Yes" : "No"}</p>
      <Grid board={board} cellColors={cellColors} />
      <Link to="/">Back to Home</Link>
    </Container>
  );
};

export default ResultPage;
