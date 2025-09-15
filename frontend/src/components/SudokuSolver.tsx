import React, { useState } from 'react'
import SudokuBoard from './SudokuBoard'
import { SudokuBoard as SudokuBoardType, SudokuApiResponse } from '../types/sudoku'

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
  }

  const solveSudoku = async () => {
    setLoading(true)
    setError('')
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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: SudokuApiResponse = await response.json()

      setNumSolutions(data.num_solutions)
      setIsExactCount(data.is_exact_num_solutions)

      const displaySolutions = data.solutions.slice(0, SUDOKU_MAX_SOLUTIONS)
      setSolutions(displaySolutions.map(sol => sol.solution))

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while solving the Sudoku')
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
          padding: '10px',
          borderRadius: '5px',
          textAlign: 'center',
          marginBottom: '20px',
        }}>
          エラー: {error}
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