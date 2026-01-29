import React, { useState, useCallback, useMemo, useEffect } from 'react'
import SudokuBoard from './SudokuBoard'
import NumberPad from './NumberPad'
import { SudokuBoard as SudokuBoardType, SudokuApiResponse, SudokuApiErrorResponse } from '../types/sudoku'
import { validateSudokuConstraints, validateNumberRange, validateBoardSize } from '../utils/sudokuValidation'

const ERROR_TYPE_LABELS: Record<string, string> = {
  InvalidInput: '📝 入力エラー',
  OutOfRangeError: '🔢 数値範囲エラー',
  ConstraintViolation: '⚠️ 制約違反エラー',
  InternalServerError: '🔧 サーバーエラー',
  NetworkError: '🌐 ネットワークエラー',
}

const ERROR_TYPE_HINTS: Record<string, string> = {
  OutOfRangeError: '💡 数独の値は1〜9の数字のみ有効です',
  ConstraintViolation: '💡 数独のルールに違反しています（同じ行・列・ブロックに同じ数字は配置できません）',
  InternalServerError: '💡 サーバーで予期しないエラーが発生しました。しばらく時間をおいて再度お試しください',
}

const SAMPLE_PUZZLES = [
  {
    name: 'サンプル1',
    board: [
      [null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, 3, null, 8, 5],
      [null, null, 1, null, 2, null, null, null, null],
      [null, null, null, 5, null, 7, null, null, null],
      [null, null, 4, null, null, null, 1, null, null],
      [null, 9, null, null, null, null, null, null, null],
      [5, null, null, null, null, null, null, 7, 3],
      [null, null, 2, null, 1, null, null, null, null],
      [null, null, null, null, 4, null, null, null, 9],
    ],
  },
  {
    name: 'サンプル2',
    board: [
      [null, null, null, 2, null, null, 7, null, 1],
      [6, null, null, null, 7, null, null, 9, null],
      [null, 9, null, null, null, 4, null, null, null],
      [null, 2, null, 1, null, null, null, 4, null],
      [null, null, 4, null, null, 2, 9, null, null],
      [null, 5, null, null, null, null, null, null, 8],
      [null, null, null, 3, null, null, null, null, 4],
      [null, 4, null, null, 5, null, null, 3, null],
      [7, null, 3, null, null, 8, null, null, null],
    ],
  },
  {
    name: 'サンプル3',
    board: [
      [8, null, null, null, null, null, null, null, 3],
      [null, null, 3, 6, null, null, null, null, null],
      [null, 7, null, null, 9, null, 2, null, null],
      [null, 5, null, null, null, 7, null, null, null],
      [null, null, null, null, null, 5, 7, null, null],
      [null, null, null, 1, null, null, null, null, null],
      [null, null, 1, null, null, null, null, 6, 8],
      [null, null, null, null, null, null, null, 1, null],
      [null, 9, null, null, null, null, 4, null, null],
    ],
  },
]

const SudokuSolver: React.FC = () => {
  const SUDOKU_LEVEL = useMemo(() => parseInt(process.env.GATSBY_SUDOKU_LEVEL || '3'), [])
  const SUDOKU_MAX_NUM_SOLUTIONS = useMemo(() => parseInt(process.env.GATSBY_SUDOKU_MAX_NUM_SOLUTIONS || '1000000'), [])
  const SUDOKU_MAX_SOLUTIONS = useMemo(() => parseInt(process.env.GATSBY_SUDOKU_MAX_SOLUTIONS || '30'), [])

  const boardSize = useMemo(() => SUDOKU_LEVEL * SUDOKU_LEVEL, [SUDOKU_LEVEL])

  const createEmptyBoard = useCallback((): SudokuBoardType => {
    return Array(boardSize).fill(null).map(() => Array(boardSize).fill(null))
  }, [boardSize])

  const [inputBoard, setInputBoard] = useState<SudokuBoardType>(() =>
    Array(SUDOKU_LEVEL * SUDOKU_LEVEL).fill(null).map(() => Array(SUDOKU_LEVEL * SUDOKU_LEVEL).fill(null))
  )
  const [solutions, setSolutions] = useState<SudokuBoardType[]>([])
  const [numSolutions, setNumSolutions] = useState<number>(0)
  const [isExactCount, setIsExactCount] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [errorDetails, setErrorDetails] = useState<{ row: number; column: number; number: number }[]>([])
  const [errorType, setErrorType] = useState<string>('')
  const [solvedFromBoard, setSolvedFromBoard] = useState<SudokuBoardType | null>(null)
  const [hasSolved, setHasSolved] = useState<boolean>(false)
  const [currentSolutionIndex, setCurrentSolutionIndex] = useState<number>(0)
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null)
  const [isMobileMode, setIsMobileMode] = useState<boolean>(false)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)

  // モバイルモード検出（現在は無効化 - 従来のinput方式を使用）
  useEffect(() => {
    // NumberPad UIは使わず、従来のキーボード入力を使用
    setIsMobileMode(false)
  }, [])

  const performRealTimeValidation = useCallback((board: SudokuBoardType) => {
    setError('')
    setErrorDetails([])
    setErrorType('')

    const outOfRangeErrors = []
    for (let row = 0; row < boardSize; row++) {
      for (let col = 0; col < boardSize; col++) {
        const value = board[row][col]
        if (value !== null && !isNaN(value) && !validateNumberRange(value, boardSize)) {
          outOfRangeErrors.push({ row, column: col, number: value })
        }
      }
    }

    if (outOfRangeErrors.length > 0) {
      setErrorType('OutOfRangeError')
      setError('入力された数値が有効な範囲外です。')
      setErrorDetails(outOfRangeErrors)
      return
    }

    const constraintValidation = validateSudokuConstraints(board)
    if (!constraintValidation.isValid) {
      setErrorType('ConstraintViolation')
      setError('数独のルールに違反している箇所があります。')
      setErrorDetails(constraintValidation.errors)
      return
    }
  }, [boardSize])

  const handleCellChange = useCallback((row: number, col: number, value: number | null) => {
    const newBoard = inputBoard.map((r, rowIndex) =>
      r.map((cell, colIndex) =>
        rowIndex === row && colIndex === col ? value : cell
      )
    )
    setInputBoard(newBoard)
    performRealTimeValidation(newBoard)
  }, [inputBoard, performRealTimeValidation])

  const clearBoard = useCallback(() => {
    setInputBoard(createEmptyBoard())
    setSolutions([])
    setNumSolutions(0)
    setIsExactCount(false)
    setError('')
    setErrorDetails([])
    setErrorType('')
    setSolvedFromBoard(null)
    setHasSolved(false)
    setCurrentSolutionIndex(0)
  }, [createEmptyBoard])

  const loadSamplePuzzle = useCallback((index: number) => {
    const puzzle = SAMPLE_PUZZLES[index]
    if (puzzle) {
      setInputBoard(puzzle.board.map(row => [...row]))
      setSolutions([])
      setNumSolutions(0)
      setIsExactCount(false)
      setError('')
      setErrorDetails([])
      setErrorType('')
      setSolvedFromBoard(null)
      setHasSolved(false)
      setCurrentSolutionIndex(0)
    }
  }, [])

  const performClientSideValidation = useCallback(() => {
    if (!validateBoardSize(inputBoard)) {
      setErrorType('InvalidInput')
      setError('盤面のサイズが正しくありません。')
      return { isValid: false }
    }

    const outOfRangeErrors = []
    for (let row = 0; row < boardSize; row++) {
      for (let col = 0; col < boardSize; col++) {
        const value = inputBoard[row][col]
        if (value !== null && !isNaN(value) && !validateNumberRange(value, boardSize)) {
          outOfRangeErrors.push({ row, column: col, number: value })
        }
      }
    }

    if (outOfRangeErrors.length > 0) {
      setErrorType('OutOfRangeError')
      setError('入力された数値が有効な範囲外です。')
      setErrorDetails(outOfRangeErrors)
      return { isValid: false }
    }

    const constraintValidation = validateSudokuConstraints(inputBoard)
    if (!constraintValidation.isValid) {
      setErrorType('ConstraintViolation')
      setError('数独のルールに違反している箇所があります。')
      setErrorDetails(constraintValidation.errors)
      return { isValid: false }
    }

    return { isValid: true }
  }, [inputBoard, boardSize])

  const solveSudoku = useCallback(async () => {
    setLoading(true)
    setError('')
    setErrorDetails([])
    setErrorType('')
    setSolutions([])
    setNumSolutions(0)
    setIsExactCount(false)
    setCurrentSolutionIndex(0)

    const clientSideValidation = performClientSideValidation()
    if (!clientSideValidation.isValid) {
      setLoading(false)
      return
    }

    try {
      const response = await fetch(process.env.GATSBY_API_URL!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ board: inputBoard }),
      })

      const data = await response.json()

      if (!response.ok) {
        const errorData: SudokuApiErrorResponse = data
        setErrorType(errorData.error.type)
        setError(errorData.error.message)
        if (errorData.error.detail) {
          setErrorDetails(errorData.error.detail)
        }
        return
      }

      const successData: SudokuApiResponse = data
      setNumSolutions(successData.num_solutions)
      setIsExactCount(successData.is_exact_num_solutions)
      setHasSolved(true)

      setSolvedFromBoard(inputBoard.map(row =>
        row.map(cell => (cell === null || isNaN(cell)) ? null : cell)
      ))

      const displaySolutions = successData.solutions.slice(0, SUDOKU_MAX_SOLUTIONS)
      setSolutions(displaySolutions.map(sol => sol.solution))

    } catch (err) {
      setError(err instanceof Error ? err.message : 'ネットワークエラーが発生しました')
      setErrorType('NetworkError')
    } finally {
      setLoading(false)
    }
  }, [inputBoard, performClientSideValidation, SUDOKU_MAX_SOLUTIONS])

  const formatSolutionCount = useCallback(() => {
    if (numSolutions === 0) return '0'
    if (numSolutions >= SUDOKU_MAX_NUM_SOLUTIONS) {
      return `${SUDOKU_MAX_NUM_SOLUTIONS.toLocaleString()}+`
    }
    return numSolutions.toLocaleString()
  }, [numSolutions, SUDOKU_MAX_NUM_SOLUTIONS])

  const getButtonStyle = useCallback((isPrimary: boolean) => ({
    padding: '14px 28px',
    minHeight: '48px',
    minWidth: '120px',
    fontSize: '18px',
    backgroundColor: isPrimary ? '#007bff' : '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: loading ? 'not-allowed' : 'pointer',
    opacity: loading ? 0.6 : 1,
    WebkitTapHighlightColor: 'rgba(0, 0, 0, 0.1)',
    touchAction: 'manipulation',
    userSelect: 'none' as const,
    fontWeight: '600',
  }), [loading])

  const handlePreviousSolution = useCallback(() => {
    setCurrentSolutionIndex(prev => Math.max(0, prev - 1))
  }, [])

  const handleNextSolution = useCallback(() => {
    setCurrentSolutionIndex(prev => Math.min(solutions.length - 1, prev + 1))
  }, [solutions.length])

  const handleBackToInput = useCallback(() => {
    setSolutions([])
    setNumSolutions(0)
    setIsExactCount(false)
    setHasSolved(false)
    setCurrentSolutionIndex(0)
  }, [])

  // セル選択ハンドラー（モバイル用）
  const handleCellSelect = useCallback((row: number, col: number) => {
    setSelectedCell({ row, col })
  }, [])

  // NumberPadからの数字選択ハンドラー
  const handleNumberPadSelect = useCallback((value: number | null) => {
    if (selectedCell) {
      handleCellChange(selectedCell.row, selectedCell.col, value)
    }
  }, [selectedCell, handleCellChange])

  // スワイプ検出用の定数
  const SWIPE_THRESHOLD = 50

  // タッチ開始ハンドラー
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!isMobileMode || solutions.length <= 1) return
    setTouchStartX(e.touches[0].clientX)
  }, [isMobileMode, solutions.length])

  // タッチ終了ハンドラー（スワイプ検出）
  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartX === null || !isMobileMode) return

    const touchEndX = e.changedTouches[0].clientX
    const diff = touchStartX - touchEndX

    if (Math.abs(diff) > SWIPE_THRESHOLD) {
      if (diff > 0 && currentSolutionIndex < solutions.length - 1) {
        // 左スワイプ = 次の解
        handleNextSolution()
      } else if (diff < 0 && currentSolutionIndex > 0) {
        // 右スワイプ = 前の解
        handlePreviousSolution()
      }
    }

    setTouchStartX(null)
  }, [touchStartX, isMobileMode, currentSolutionIndex, solutions.length, handleNextSolution, handlePreviousSolution])

  return (
    <div style={{
      padding: '20px',
      paddingBottom: isMobileMode && solutions.length === 0 ? '220px' : '20px',
      fontFamily: '-apple-system, Roboto, sans-serif',
      maxWidth: '100%',
      overflowX: 'auto',
      WebkitTextSizeAdjust: '100%',
    }}>
      <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '30px' }}>
        数独ソルバー
      </h1>

      {solutions.length === 0 ? (
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <SudokuBoard
            board={inputBoard}
            title="問題を入力してください"
            isInput={true}
            onChange={handleCellChange}
            invalidCells={errorDetails}
            isMobileMode={isMobileMode}
            selectedCell={selectedCell}
            onCellSelect={handleCellSelect}
          />

          <div style={{
            marginTop: '20px',
            display: 'flex',
            gap: '10px',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}>
            <button
              onClick={solveSudoku}
              disabled={loading}
              style={getButtonStyle(true)}
            >
              {loading ? '解いています...' : '解く'}
            </button>

            <button
              onClick={clearBoard}
              disabled={loading}
              style={getButtonStyle(false)}
            >
              クリア
            </button>
          </div>

          <div style={{
            marginTop: '15px',
            display: 'flex',
            gap: '10px',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}>
            {SAMPLE_PUZZLES.map((puzzle, index) => (
              <button
                key={index}
                onClick={() => loadSamplePuzzle(index)}
                disabled={loading}
                style={{
                  padding: '8px 16px',
                  fontSize: '14px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1,
                  fontWeight: '500',
                }}
              >
                {puzzle.name}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div
          style={{ textAlign: 'center', marginBottom: '30px' }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ color: '#333', margin: '0 0 5px 0' }}>
              解の個数: {isExactCount && numSolutions >= SUDOKU_MAX_NUM_SOLUTIONS && (
                <span style={{ color: '#28a745' }}>ちょうど </span>
              )}
              <span style={{ color: '#007bff' }}>{formatSolutionCount()}</span>
            </h2>
            <p style={{ color: '#666', margin: 0 }}>
              {Math.min(solutions.length, SUDOKU_MAX_SOLUTIONS)}個の解を表示中
              {isMobileMode && solutions.length > 1 && ' (左右スワイプで切替)'}
            </p>
          </div>

          <SudokuBoard
            board={solutions[currentSolutionIndex]}
            originalBoard={solvedFromBoard || undefined}
          />

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
            marginTop: '20px',
          }}>
            <button
              onClick={handlePreviousSolution}
              disabled={currentSolutionIndex === 0}
              style={{
                padding: '12px 24px',
                fontSize: '20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: currentSolutionIndex === 0 ? 'not-allowed' : 'pointer',
                opacity: currentSolutionIndex === 0 ? 0.4 : 1,
                fontWeight: '600',
                minWidth: '60px',
              }}
            >
              ←
            </button>

            <span style={{ fontSize: '18px', fontWeight: '600', minWidth: '150px' }}>
              解 {currentSolutionIndex + 1} / {solutions.length}
            </span>

            <button
              onClick={handleNextSolution}
              disabled={currentSolutionIndex === solutions.length - 1}
              style={{
                padding: '12px 24px',
                fontSize: '20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: currentSolutionIndex === solutions.length - 1 ? 'not-allowed' : 'pointer',
                opacity: currentSolutionIndex === solutions.length - 1 ? 0.4 : 1,
                fontWeight: '600',
                minWidth: '60px',
              }}
            >
              →
            </button>
          </div>

          <button
            onClick={handleBackToInput}
            style={{
              marginTop: '20px',
              padding: '14px 28px',
              minHeight: '48px',
              minWidth: '120px',
              fontSize: '18px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
            }}
          >
            戻る
          </button>
        </div>
      )}

      {error && (
        <div className="error-message" style={{
          backgroundColor: '#f8d7da',
          color: '#721c24',
          padding: '15px',
          borderRadius: '5px',
          marginBottom: '20px',
          border: '1px solid #f5c6cb',
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>
            {ERROR_TYPE_LABELS[errorType] || 'エラー'}
          </div>
          <div style={{ marginBottom: errorDetails.length > 0 ? '10px' : '0' }}>
            {error}
          </div>
          {errorDetails.length > 0 && (
            <div>
              <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>問題のある位置:</div>
              <div style={{ fontSize: '14px' }}>
                {errorDetails.map((detail, index) => (
                  <div key={index} style={{ marginBottom: '2px' }}>
                    行 {detail.row + 1}, 列 {detail.column + 1}: 値 {detail.number}
                  </div>
                ))}
              </div>
              {ERROR_TYPE_HINTS[errorType] && (
                <div style={{ marginTop: '10px', fontSize: '14px', fontStyle: 'italic' }}>
                  {ERROR_TYPE_HINTS[errorType]}
                </div>
              )}
            </div>
          )}
          {errorType === 'InternalServerError' && errorDetails.length === 0 && (
            <div style={{ marginTop: '10px', fontSize: '14px', fontStyle: 'italic' }}>
              {ERROR_TYPE_HINTS.InternalServerError}
            </div>
          )}
        </div>
      )}

      {numSolutions === 0 && hasSolved && !loading && !error && (
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: '#333' }}>
            解が見つかりませんでした
          </h2>
          <p style={{ color: '#666', fontStyle: 'italic' }}>
            この問題には解がありません。入力を確認してください。
          </p>
        </div>
      )}

      {/* モバイル用NumberPad */}
      {isMobileMode && solutions.length === 0 && (
        <NumberPad
          onNumberSelect={handleNumberPadSelect}
          disabled={loading}
          selectedCell={selectedCell}
        />
      )}

    </div>
  )
}

export default SudokuSolver