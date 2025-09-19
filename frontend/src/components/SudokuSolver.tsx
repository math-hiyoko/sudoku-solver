import React, { useState } from 'react'
import SudokuBoard from './SudokuBoard'
import { SudokuBoard as SudokuBoardType, SudokuApiResponse, SudokuApiErrorResponse } from '../types/sudoku'

const SudokuSolver: React.FC = () => {
  const SUDOKU_LEVEL = parseInt(process.env.GATSBY_SUDOKU_LEVEL || '3')
  const SUDOKU_MAX_NUM_SOLUTIONS = parseInt(process.env.GATSBY_SUDOKU_MAX_NUM_SOLUTIONS || '1000000')
  const SUDOKU_MAX_SOLUTIONS = parseInt(process.env.GATSBY_SUDOKU_MAX_SOLUTIONS || '30')

  const boardSize = SUDOKU_LEVEL * SUDOKU_LEVEL

  const createEmptyBoard = (): SudokuBoardType => {
    return Array(boardSize).fill(null).map(() => Array(boardSize).fill(null))
  }

  const [inputBoard, setInputBoard] = useState<SudokuBoardType>(createEmptyBoard())
  const [solutions, setSolutions] = useState<SudokuBoardType[]>([])
  const [numSolutions, setNumSolutions] = useState<number>(0)
  const [isExactCount, setIsExactCount] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [errorDetails, setErrorDetails] = useState<{ row: number; column: number; number: number }[]>([])
  const [errorType, setErrorType] = useState<string>('')

  const handleCellChange = (row: number, col: number, value: number | null) => {
    const newBoard = inputBoard.map((r, rowIndex) =>
      r.map((cell, colIndex) =>
        rowIndex === row && colIndex === col ? value : cell
      )
    )
    setInputBoard(newBoard)
  }

  const clearBoard = () => {
    setInputBoard(createEmptyBoard())
    setSolutions([])
    setNumSolutions(0)
    setIsExactCount(false)
    setError('')
    setErrorDetails([])
    setErrorType('')
  }

  const solveSudoku = async () => {
    setLoading(true)
    setError('')
    setErrorDetails([])
    setErrorType('')
    setSolutions([])
    setNumSolutions(0)
    setIsExactCount(false)

    try {
      const response = await fetch('https://4cubkquqti.execute-api.ap-northeast-1.amazonaws.com/solve-sudoku', {
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

      const displaySolutions = successData.solutions.slice(0, SUDOKU_MAX_SOLUTIONS)
      setSolutions(displaySolutions.map(sol => sol.solution))

    } catch (err) {
      setError(err instanceof Error ? err.message : 'ネットワークエラーが発生しました')
      setErrorType('NetworkError')
    } finally {
      setLoading(false)
    }
  }

  const formatSolutionCount = () => {
    if (numSolutions === 0) return '0'
    if (numSolutions >= SUDOKU_MAX_NUM_SOLUTIONS) {
      return `${SUDOKU_MAX_NUM_SOLUTIONS.toLocaleString()}+`
    }
    return numSolutions.toLocaleString()
  }

  return (
    <div style={{ padding: '20px', fontFamily: '-apple-system, Roboto, sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '30px' }}>
        数独ソルバー
      </h1>

      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <SudokuBoard
          board={inputBoard}
          title="問題を入力してください"
          isInput={true}
          onChange={handleCellChange}
        />

        <div style={{ marginTop: '20px' }}>
          <button
            onClick={solveSudoku}
            disabled={loading}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginRight: '10px',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? '解いています...' : '解く'}
          </button>

          <button
            onClick={clearBoard}
            disabled={loading}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
            }}
          >
            クリア
          </button>
        </div>
      </div>

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
            {errorType === 'InvalidInput' && '📝 入力エラー'}
            {errorType === 'OutOfRangeError' && '🔢 数値範囲エラー'}
            {errorType === 'ConstraintViolation' && '⚠️ 制約違反エラー'}
            {errorType === 'InternalServerError' && '🔧 サーバーエラー'}
            {errorType === 'NetworkError' && '🌐 ネットワークエラー'}
            {!errorType && 'エラー'}
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
              <div style={{ marginTop: '10px', fontSize: '14px', fontStyle: 'italic' }}>
                {errorType === 'OutOfRangeError' && '💡 数独の値は1〜9の数字のみ有効です'}
                {errorType === 'ConstraintViolation' && '💡 数独のルールに違反しています（同じ行・列・ブロックに同じ数字は配置できません）'}
              </div>
            </div>
          )}
          {errorType === 'InternalServerError' && (
            <div style={{ marginTop: '10px', fontSize: '14px', fontStyle: 'italic' }}>
              💡 サーバーで予期しないエラーが発生しました。しばらく時間をおいて再度お試しください
            </div>
          )}
        </div>
      )}

      {numSolutions > 0 && (
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: '#333' }}>
            解の個数: {formatSolutionCount()}
            {!isExactCount && numSolutions >= SUDOKU_MAX_NUM_SOLUTIONS && ' (概算)'}
          </h2>
          {solutions.length > 0 && (
            <p style={{ color: '#666' }}>
              以下に{Math.min(solutions.length, SUDOKU_MAX_SOLUTIONS)}個の解を表示しています
            </p>
          )}
        </div>
      )}

      <div className="solution-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '30px',
        justifyItems: 'center',
      }}>
        {solutions.map((solution, index) => (
          <SudokuBoard
            key={index}
            board={solution}
            title={`解 ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default SudokuSolver