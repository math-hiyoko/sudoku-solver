import React, { useState } from "react";
import styled from "styled-components";
import Grid from "../components/Grid";
import NumberInput from "../components/NumberInput";
import Footer from "../components/Footer";

const sudokuDim = parseInt(process.env.SUDOKU_DIM, 10) || 3;
const gridSize = sudokuDim * sudokuDim;
const initialBoard = Array(gridSize * gridSize).fill("");

const Container = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Content = styled.div`
  flex: 1;
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
    setLoading(true);

    const isValidInput = board.every(
      (cell) => /^[1-9]$/.test(cell) || cell === "",
    );

    if (!isValidInput) {
      setError("Please enter numbers between 1 and 9.");
      setLoading(false);
      return;
    }

    const board2D = [];
    for (let row = 0; row < gridSize; row++) {
      const start = row * gridSize;
      const end = start + gridSize;
      board2D.push(board.slice(start, end).map(val => (val === "" ? 0 : parseInt(val, 10))));
    }
    
    try {
      const response = await fetch(
        "https://4cubkquqti.execute-api.-northeast-1.amazonaws.com/SolveSudoku",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ "board": board2D }),
        },
      );
      const data = await response.json();
      console.log("Solved Board:", data.solution);
      setBoard(data.solution.flat());
    } catch (error) {
      console.error("Error solving sudoku:", error);
      setError("There was an error solving the puzzle. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleNumberSelect = (number) => {
    setSelectedNumber(number);
  };

  const handleCellClick = (index) => {
    const newBoard = [...board];
    newBoard[index] = selectedNumber !== "delete" ? selectedNumber : '';
    setBoard(newBoard);
  };

  return (
    <Container>
      <Content>
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
          </ButtonContainer>
        )}
      </Content>
      <Footer />
    </Container>
  );
};

export default IndexPage;
