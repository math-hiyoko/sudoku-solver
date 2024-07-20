import config from "../config";

/**
 * ボードの範囲と制約をチェックする関数
 * @param board 現在のボード
 * @returns エラーメッセージと詳細
 */
export default function validateBoard(board: (number | undefined)[]): number[] {
  let invalidCells: Set<number> = new Set();

  // 数字入力チェック
  for (let row: number = 0; row < config.gridSize; row++) {
    for (let col: number = 0; col < config.gridSize; col++) {
      const value: number | undefined = board[row * config.gridSize + col];
      if (value !== undefined && !Number.isSafeInteger(value)) {
        invalidCells.add(row * config.gridSize + col);
      }
    }
  }

  if (invalidCells.size > 0) {
    return Array.from(invalidCells);
  }

  // 範囲チェック
  for (let row: number = 0; row < config.gridSize; row++) {
    for (let col: number = 0; col < config.gridSize; col++) {
      const value: number | undefined = board[row * config.gridSize + col];
      if (
        value !== undefined &&
        Number.isSafeInteger(value) &&
        (value < 1 || value > config.gridSize)
      ) {
        invalidCells.add(row * config.gridSize + col);
      }
    }
  }

  if (invalidCells.size > 0) {
    return Array.from(invalidCells);
  }

  // 行チェック
  for (let row: number = 0; row < config.gridSize; row++) {
    const check: number[] = Array(config.gridSize).fill(0);
    for (let col = 0; col < config.gridSize; col++) {
      const value: number | undefined = board[row * config.gridSize + col];
      if (value !== undefined && Number.isSafeInteger(value)) {
        check[value - 1]++;
      }
    }
    for (let col: number = 0; col < config.gridSize; col++) {
      const value: number | undefined = board[row * config.gridSize + col];
      if (
        value !== undefined &&
        Number.isSafeInteger(value) &&
        check[value - 1] > 1
      ) {
        invalidCells.add(row * config.gridSize + col);
      }
    }
  }

  // 列についてのチェック
  for (let col: number = 0; col < config.gridSize; col++) {
    const check: number[] = Array(config.gridSize).fill(0);
    for (let row: number = 0; row < config.gridSize; row++) {
      const value: number | undefined = board[row * config.gridSize + col];
      if (value !== undefined && Number.isSafeInteger(value)) {
        check[value - 1]++;
      }
    }
    for (let row: number = 0; row < config.gridSize; row++) {
      const value: number | undefined = board[row * config.gridSize + col];
      if (
        value !== undefined &&
        Number.isSafeInteger(value) &&
        check[value - 1] > 1
      ) {
        invalidCells.add(row * config.gridSize + col);
      }
    }
  }

  // ブロックについてのチェック
  for (let blockRow: number = 0; blockRow < config.sudokuDim; blockRow++) {
    for (let blockCol: number = 0; blockCol < config.sudokuDim; blockCol++) {
      const check: number[] = Array(config.gridSize).fill(0);
      for (let row: number = 0; row < config.sudokuDim; row++) {
        for (let col: number = 0; col < config.sudokuDim; col++) {
          const value: number | undefined =
            board[
              (blockRow * config.sudokuDim + row) * config.gridSize +
                (blockCol * config.sudokuDim + col)
            ];
          if (value !== undefined && Number.isSafeInteger(value)) {
            check[value - 1]++;
          }
        }
      }
      for (let row: number = 0; row < config.sudokuDim; row++) {
        for (let col: number = 0; col < config.sudokuDim; col++) {
          const value: number | undefined =
            board[
              (blockRow * config.sudokuDim + row) * config.gridSize +
                (blockCol * config.sudokuDim + col)
            ];
          if (
            value !== undefined &&
            Number.isSafeInteger(value) &&
            check[value - 1] > 1
          ) {
            invalidCells.add(
              (blockRow * config.sudokuDim + row) * config.gridSize +
                (blockCol * config.sudokuDim + col),
            );
          }
        }
      }
    }
  }

  return Array.from(invalidCells);
}
