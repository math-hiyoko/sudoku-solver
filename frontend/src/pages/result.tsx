import React from "react";
import { Link } from "gatsby";
import Grid from "../components/common/Grid";
import { Container } from "../styles/CommonStyles";
import config from "../config";
import Layout from "../components/Layout";

interface LocationState {
  solution: number[][];
  numSolutions: number;
  isExactNumSolutions: boolean;
  userBoard: (number | undefined)[];
}

interface ResultPageProps {
  location: {
    state?: LocationState;
  };
}

const ResultPage: React.FC<ResultPageProps> = ({ location }) => {
  const { solution, numSolutions, isExactNumSolutions, userBoard } =
    location.state ?? {};

  if (
    !solution ||
    numSolutions === undefined ||
    isExactNumSolutions === undefined ||
    !userBoard
  ) {
    return <p>Loading...</p>;
  }

  const board: number[] = [];
  const cellColors: ("black" | "blue")[] = Array(
    config.gridSize * config.gridSize,
  ).fill("black");
  for (let i: number = 0; i < config.gridSize; i++) {
    for (let j: number = 0; j < config.gridSize; j++) {
      const index: number = i * config.gridSize + j;
      board.push(solution[i][j]);
      if (userBoard[index] === undefined) {
        cellColors[index] = "blue";
      }
    }
  }

  return (
    <Layout>
      <h1>Sudoku Solution</h1>
      <p>Number of Solutions: {numSolutions}</p>
      <p>Is Exact Number of Solutions: {isExactNumSolutions ? "Yes" : "No"}</p>
      <Grid board={board} cellColors={cellColors} />
      <Link to="/">Back to Home</Link>
    </Layout>
  );
};

export default ResultPage;
