import { useState, useEffect } from "react";
import validateBoard from "../utils/validateBoard";
import fetchWithHandling from "../utils/fetchWithHandling";
import { SolveSudokuResponse } from "../types";
import { loadState, saveState } from "../utils/localStorage";
import { navigate } from "gatsby";
import config from "../config";

export default function useSudoku() {
  const initialBoard: (number | undefined)[] = loadState(
    config.BOARD_STATE_KEY,
    Array(config.gridSize * config.gridSize).fill(undefined),
  );

  const [board, setBoard] = useState<(number | undefined)[]>(initialBoard);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<null | string>(null);
  const [errorDetails, setErrorDetails] = useState<number[]>([]);
  const [selectedNumber, setSelectedNumber] = useState<
    number | "delete" | undefined
  >(undefined);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    saveState(config.BOARD_STATE_KEY, board);
  }, [board]);

  const handleSolve = async () => {
    if (isSubmitting) return;

    setError(null);
    setErrorDetails([]);
    setLoading(true);

    const invalidCells: number[] = validateBoard(board);
    if (invalidCells.length > 0) {
      setError("Input validation error. Please check the highlighted cells.");
      setErrorDetails(invalidCells);
      setLoading(false);
      return;
    }

    setIsSubmitting(true);

    const board2D: number[][] = [];
    for (let row = 0; row < config.gridSize; row++) {
      const start: number = row * config.gridSize;
      const end: number = start + config.gridSize;
      board2D.push(
        board.slice(start, end).map((val) => (val === undefined ? 0 : val)),
      );
    }

    try {
      const data = await fetchWithHandling<SolveSudokuResponse>(
        "https://4cubkquqti.execute-api.ap-northeast-1.amazonaws.com/SolveSudoku",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ board: board2D }),
        },
      );

      if (data.num_solutions === 0) {
        setError("No solution found");
        setLoading(false);
        setIsSubmitting(false);
        return;
      }

      navigate("/result", {
        state: {
          solution: data.solution,
          numSolutions: data.num_solutions,
          isExactNumSolutions: data.is_exact_num_solutions,
          userBoard: board,
        },
      });
    } catch (error) {
      console.error("Error solving sudoku:", error);
      setError(error.message);
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  return {
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
  };
}
