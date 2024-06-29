const sudokuDim = parseInt(process.env.SUDOKU_DIM, 10) || 3;
const gridSize = sudokuDim * sudokuDim;

/**
 * ボードの範囲と制約をチェックする関数
 * @param board 現在のボード
 * @returns エラーメッセージと詳細
 */
export const validateBoard = (board) => {
  let invalidCells = new Set();

  // 数字入力チェック
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const value = board[row * gridSize + col];
      if (value !== "" && isNaN(value)) {
        invalidCells.add(row * gridSize + col);
      }
    }
  }

  if (invalidCells.length > 0) {
    return Array.from(invalidCells);
  }

  // 範囲チェック
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const value = board[row * gridSize + col];
      if (value !== "" && (value < 1 || value > gridSize)) {
        invalidCells.push(row * gridSize + col);
      }
    }
  }

  if (invalidCells.length > 0) {
    return Array.from(invalidCells);
  }

  // 行チェック
  for (let row = 0; row < gridSize; row++) {
    const check = Array(gridSize).fill(0);
    for (let col = 0; col < gridSize; col++) {
      const value = board[row * gridSize + col];
      if (value !== "") {
        check[value - 1]++;
      }
    }
    for (let col = 0; col < gridSize; col++) {
      const value = board[row * gridSize + col];
      if (value !== "" && check[value - 1] > 1) {
        invalidCells.add(row * gridSize + col);
      }
    }
  }

  // 列についてのチェック
  for (let col = 0; col < gridSize; col++) {
    const check = Array(gridSize).fill(0);
    for (let row = 0; row < gridSize; row++) {
      const value = board[row * gridSize + col];
      if (value !== "") {
        check[value - 1]++;
      }
    }
    for (let row = 0; row < gridSize; row++) {
      const value = board[row * gridSize + col];
      if (value !== "" && check[value - 1] > 1) {
        invalidCells.add(row * gridSize + col);
      }
    }
  }

  // ブロックについてのチェック
  for (let blockRow = 0; blockRow < sudokuDim; blockRow++) {
    for (let blockCol = 0; blockCol < sudokuDim; blockCol++) {
      const check = Array(gridSize).fill(0);
      for (let row = 0; row < sudokuDim; row++) {
        for (let col = 0; col < sudokuDim; col++) {
          const value =
            board[
              (blockRow * sudokuDim + row) * gridSize +
                (blockCol * sudokuDim + col)
            ];
          if (value !== "") {
            check[value - 1]++;
          }
        }
      }
      for (let row = 0; row < sudokuDim; row++) {
        for (let col = 0; col < sudokuDim; col++) {
          const value =
            board[
              (blockRow * sudokuDim + row) * gridSize +
                (blockCol * sudokuDim + col)
            ];
          if (value !== "" && check[value - 1] > 1) {
            invalidCells.add(
              (blockRow * sudokuDim + row) * gridSize +
                (blockCol * sudokuDim + col),
            );
          }
        }
      }
    }
  }

  return Array.from(invalidCells);
};
