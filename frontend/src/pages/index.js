import React, { useState } from "react";
import { navigate } from "gatsby";
import Grid from "../components/Grid";
import NumberInput from "../components/NumberInput";
import Footer from "../components/Footer";
import { validateBoard } from "../utils/validateBoard";
import {
  Button,
  Container,
  Content,
  ButtonContainer,
  ErrorMessage,
} from "../styles/CommonStyles";

const sudokuDim = parseInt(process.env.SUDOKU_DIM, 10) || 3;
const gridSize = sudokuDim * sudokuDim;
const initialBoard = Array(gridSize * gridSize).fill(undefined);

const IndexPage = () => {
  const [board, setBoard] = useState(initialBoard);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errorDetails, setErrorDetails] = useState([]);
  const [selectedNumber, setSelectedNumber] = useState(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSolve = async () => {
    if (isSubmitting) return; // すでに処理中の場合は何もしない
    setIsSubmitting(true);

    setError(null);
    setErrorDetails([]);
    setLoading(true);

    const invalidCells = validateBoard(board);
    if (invalidCells.length > 0) {
      setError("Input validation error. Please check the highlighted cells.");
      setErrorDetails(invalidCells);
      setLoading(false);
      return;
    }

    const board2D = [];
    for (let row = 0; row < gridSize; row++) {
      const start = row * gridSize;
      const end = start + gridSize;
      board2D.push(
        board
          .slice(start, end)
          .map((val) => (val === undefined ? 0 : parseInt(val, 10))),
      );
    }

    try {
      const response = await fetch(
        "https://4cubkquqti.execute-api.ap-northeast-1.amazonaws.com/SolveSudoku",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ board: board2D }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        if (data.num_solutions === 0) {
          console.error("No solution found");
          setError("No solution found");
          setLoading(false);
          return;
        }

        console.log("Solved Board:", data.solution);

        navigate("/result", {
          state: {
            solution: data.solution,
            numSolutions: data.num_solutions,
            isExactNumSolutions: data.is_exact_num_solutions,
            userBoard: board,
          },
        });
      } else {
        const errorData = await response.json();
        console.error("Error solving sudoku:", errorData);

        const allowedErrorTypes = ["OutOfRangeError", "ConstraintViolation"];
        if (!allowedErrorTypes.includes(errorData.error?.type)) {
          throw new Error(errorData.error.message || "Unexpected error");
        }

        setError(
          errorData.error.message ||
            "Input validation error. Please check the highlighted cells.",
        );
        const detailedErrors = errorData.error.detail.map(
          (detail) => detail.row * gridSize + detail.column,
        );
        setErrorDetails(detailedErrors);
      }
    } catch (error) {
      console.error("Error solving sudoku:", error);
      setError("There was an error solving the puzzle. Please try again.");
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  const handleNumberSelect = (number) => {
    setSelectedNumber(number);
  };

  const handleCellClick = (index) => {
    if (selectedNumber === undefined) return;

    const newBoard = [...board];
    newBoard[index] = selectedNumber !== "delete" ? selectedNumber : undefined;
    setBoard(newBoard);

    const invalidCells = validateBoard(newBoard);
    setError(
      invalidCells.length > 0
        ? "Input validation error. Please check the highlighted cells."
        : null,
    );
    setErrorDetails(invalidCells);
  };

  const handleClear = () => {
    setBoard(Array(gridSize * gridSize).fill(undefined));
    setErrorDetails([]);
    setError(null);
  };

  const cellColors = board.map((cell) => (cell !== undefined ? "black" : ""));

  return (
    <Container>
      <Content>
        <h1>Sudoku Solver</h1>
        <NumberInput onSelect={handleNumberSelect} />
        <Grid
          board={board}
          onCellClick={handleCellClick}
          errorDetails={errorDetails}
          cellColors={cellColors}
        />
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ButtonContainer>
            <Button onClick={handleSolve} disabled={isSubmitting}>
              Solve
            </Button>
            <Button onClick={handleClear} disabled={isSubmitting}>
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
