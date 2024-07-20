const sudokuDim: number = parseInt(process.env.SUDOKU_DIM ?? "3", 10);
if (isNaN(sudokuDim) || sudokuDim <= 0) {
  throw new Error("Invalid environment variable: SUDOKU_DIM");
}

const config = {
  sudokuDim,
  gridSize: sudokuDim * sudokuDim,
};

export default config;
