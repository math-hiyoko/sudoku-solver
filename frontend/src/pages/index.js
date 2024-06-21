import React, { useState } from "react";
import styled from "styled-components";
import Grid from "../components/Grid";
import NumberInput from "../components/NumberInput";

const sudokuDim = parseInt(process.env.SUDOKU_DIM, 10) || 3;
const gridSize = sudokuDim * sudokuDim;
const initialBoard = Array(gridSize * gridSize).fill("");

const Container = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 1em;
  margin: 5px;
`;

const IndexPage = () => {
  const [board, setBoard] = useState(initialBoard);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedNumber, setSelectedNumber] = useState(null);

  const handleSolve = async () => {
    setError(null);

    const isValidInput = board.every(
      (cell) => /^[1-9]$/.test(cell) || cell === "",
    );

    if (!isValidInput) {
      setError("Please enter numbers between 1 and 9.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        "https://your-api-endpoint.amazonaws.com/your-stage/your-resource",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ board }),
        },
      );
      const data = await response.json();
      setLoading(false);
      console.log("Solved Board:", data.solvedBoard);
    } catch (error) {
      console.error("Error solving sudoku:", error);
      setLoading(false);
      setError("There was an error solving the puzzle. Please try again.");
    }
  };

  const handleNumberSelect = (number) => {
    setSelectedNumber(number);
  };

  const handleCellClick = (index) => {
    if (selectedNumber !== null) {
      const newBoard = [...board];
      newBoard[index] = selectedNumber;
      setBoard(newBoard);
    }
  };

  return (
    <Container>
      <h1>Sudoku Solver</h1>
      <NumberInput onSelect={handleNumberSelect} />
      <Grid board={board} setBoard={setBoard} onCellClick={handleCellClick} />
      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ButtonContainer>
          <Button onClick={handleSolve}>Solve</Button>
          <Button onClick={() => setBoard(Array(gridSize * gridSize).fill(""))}>
            Clear
          </Button>
          <Button>Random</Button>
        </ButtonContainer>
      )}
    </Container>
  );
};

export default IndexPage;
