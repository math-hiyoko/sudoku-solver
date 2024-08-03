import React from "react";
import Grid from "../components/common/Grid";
import NumberInput from "../components/common/NumberInput";
import { Button, ButtonContainer, ErrorMessage } from "../styles/CommonStyles";
import useSudoku from "../hooks/useSudoku";
import validateBoard from "../utils/validateBoard";
import config from "../config";
import Layout from "../components/Layout";

const IndexPage: React.FC = () => {
  const {
    board,
    loading,
    error,
    errorDetails,
    selectedNumber,
    isSubmitting,
    setBoard,
    setLoading,
    setError,
    setErrorDetails,
    setSelectedNumber,
    setIsSubmitting,
    handleSolve,
  } = useSudoku();

  const handleNumberSelect = (number: number | "delete" | undefined): void => {
    setSelectedNumber(number);
  };

  const handleCellClick = (index: number): void => {
    if (selectedNumber === undefined) return;

    const newBoard: (number | undefined)[] = [...board];
    newBoard[index] = selectedNumber !== "delete" ? selectedNumber : undefined;
    setBoard(newBoard);

    const invalidCells: number[] = validateBoard(newBoard);
    setError(
      invalidCells.length > 0
        ? "Input validation error. Please check the highlighted cells."
        : null,
    );
    setErrorDetails(invalidCells);
  };

  const handleClear = (): void => {
    const clearedBoard: (number | undefined)[] = Array(
      config.gridSize * config.gridSize,
    ).fill(undefined);
    setBoard(clearedBoard);
    setErrorDetails([]);
    setError(null);
  };

  const cellColors: ("black" | "")[] = board.map((cell) =>
    cell !== undefined ? "black" : "",
  );

  return (
    <Layout>
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
          <Button
            data-testid="solve-button"
            onClick={handleSolve}
            disabled={isSubmitting || errorDetails.length > 0}
          >
            Solve
          </Button>
          <Button onClick={handleClear} disabled={isSubmitting}>
            Clear
          </Button>
        </ButtonContainer>
      )}
    </Layout>
  );
};

export default IndexPage;
