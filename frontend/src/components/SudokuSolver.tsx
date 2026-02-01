import React, { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import SudokuBoard from './SudokuBoard'
import ErrorDisplay from './ErrorDisplay'
import { SudokuBoard as SudokuBoardType, SudokuApiResponse, SudokuApiErrorResponse, SudokuErrorDetail } from '../types/sudoku'
import { validateSudokuConstraints, validateNumberRange, validateBoardSize } from '../utils/sudokuValidation'
import { config, boardSize, SAMPLE_PUZZLES, createEmptyBoard } from '../config'

interface SolverState {
  inputBoard: SudokuBoardType
  solutions: SudokuBoardType[]
  numSolutions: number
  isExactCount: boolean
  loading: boolean
  error: string
  errorDetails: SudokuErrorDetail[]
  errorType: string
  solvedFromBoard: SudokuBoardType | null
  hasSolved: boolean
  currentSolutionIndex: number
}

const initialState: SolverState = {
  inputBoard: createEmptyBoard(),
  solutions: [],
  numSolutions: 0,
  isExactCount: false,
  loading: false,
  error: '',
  errorDetails: [],
  errorType: '',
  solvedFromBoard: null,
  hasSolved: false,
  currentSolutionIndex: 0,
}

const SudokuSolver: React.FC = () => {
  const { t } = useTranslation()
  const [state, setState] = useState<SolverState>(initialState)

  const {
    inputBoard, solutions, numSolutions, isExactCount,
    loading, error, errorDetails, errorType,
    solvedFromBoard, hasSolved, currentSolutionIndex,
  } = state

  const setError = useCallback((type: string, message: string, details: SudokuErrorDetail[] = []) => {
    setState(s => ({ ...s, error: message, errorType: type, errorDetails: details }))
  }, [])

  const validateBoard = useCallback((board: SudokuBoardType) => {
    const outOfRangeErrors: SudokuErrorDetail[] = []
    for (let row = 0; row < boardSize; row++) {
      for (let col = 0; col < boardSize; col++) {
        const value = board[row][col]
        if (value !== null && !isNaN(value) && !validateNumberRange(value, boardSize)) {
          outOfRangeErrors.push({ row, column: col, number: value })
        }
      }
    }
    if (outOfRangeErrors.length > 0) {
      return { isValid: false, errorType: 'OutOfRangeError', errors: outOfRangeErrors }
    }

    const constraintValidation = validateSudokuConstraints(board)
    if (!constraintValidation.isValid) {
      return { isValid: false, errorType: 'ConstraintViolation', errors: constraintValidation.errors }
    }

    return { isValid: true, errorType: '', errors: [] }
  }, [])

  const handleCellChange = useCallback((row: number, col: number, value: number | null) => {
    setState(s => {
      const newBoard = s.inputBoard.map((r, ri) =>
        r.map((cell, ci) => (ri === row && ci === col ? value : cell))
      )
      const validation = validateBoard(newBoard)
      return {
        ...s,
        inputBoard: newBoard,
        error: validation.isValid ? '' : t(`errors.${validation.errorType === 'OutOfRangeError' ? 'outOfRange' : 'constraintViolation'}`),
        errorType: validation.errorType,
        errorDetails: validation.errors,
      }
    })
  }, [validateBoard, t])

  const clearBoard = useCallback(() => {
    setState({ ...initialState, inputBoard: createEmptyBoard() })
  }, [])

  const loadSamplePuzzle = useCallback((index: number) => {
    const puzzle = SAMPLE_PUZZLES[index]
    if (puzzle) {
      setState({
        ...initialState,
        inputBoard: puzzle.board.map(row => [...row]),
      })
    }
  }, [])

  const solveSudoku = useCallback(async () => {
    setState(s => ({
      ...s,
      loading: true,
      error: '',
      errorDetails: [],
      errorType: '',
      solutions: [],
      numSolutions: 0,
      isExactCount: false,
      currentSolutionIndex: 0,
    }))

    if (!validateBoardSize(inputBoard)) {
      setError('InvalidInput', t('errors.invalidBoardSize'))
      setState(s => ({ ...s, loading: false }))
      return
    }

    const validation = validateBoard(inputBoard)
    if (!validation.isValid) {
      const errorMsg = validation.errorType === 'OutOfRangeError'
        ? t('errors.outOfRange')
        : t('errors.constraintViolation')
      setError(validation.errorType, errorMsg, validation.errors)
      setState(s => ({ ...s, loading: false }))
      return
    }

    try {
      const response = await fetch(config.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ board: inputBoard }),
      })

      const data = await response.json()

      if (!response.ok) {
        const errorData: SudokuApiErrorResponse = data
        setError(errorData.error.type, errorData.error.message, errorData.error.detail || [])
        setState(s => ({ ...s, loading: false }))
        return
      }

      const successData: SudokuApiResponse = data
      const displaySolutions = successData.solutions.slice(0, config.maxDisplaySolutions)

      setState(s => ({
        ...s,
        loading: false,
        numSolutions: successData.num_solutions,
        isExactCount: successData.is_exact_num_solutions,
        hasSolved: true,
        solvedFromBoard: inputBoard.map(row =>
          row.map(cell => (cell === null || isNaN(cell)) ? null : cell)
        ),
        solutions: displaySolutions.map(sol => sol.solution),
      }))
    } catch (err) {
      setError('NetworkError', err instanceof Error ? err.message : t('errors.networkErrorOccurred'))
      setState(s => ({ ...s, loading: false }))
    }
  }, [inputBoard, validateBoard, setError, t])

  const formatSolutionCount = () => {
    if (numSolutions === 0) return '0'
    if (numSolutions >= config.maxNumSolutions) {
      return `${config.maxNumSolutions.toLocaleString()}+`
    }
    return numSolutions.toLocaleString()
  }

  const handlePreviousSolution = useCallback(() => {
    setState(s => ({ ...s, currentSolutionIndex: Math.max(0, s.currentSolutionIndex - 1) }))
  }, [])

  const handleNextSolution = useCallback(() => {
    setState(s => ({ ...s, currentSolutionIndex: Math.min(s.solutions.length - 1, s.currentSolutionIndex + 1) }))
  }, [])

  const handleBackToInput = useCallback(() => {
    setState(s => ({
      ...s,
      solutions: [],
      numSolutions: 0,
      isExactCount: false,
      hasSolved: false,
      currentSolutionIndex: 0,
    }))
  }, [])

  return (
    <div className="solver-container">
      <h1 className="solver-title">{t('app.title')}</h1>

      {solutions.length === 0 ? (
        <div className="board-section">
          <SudokuBoard
            board={inputBoard}
            title={t('board.inputPrompt')}
            isInput={true}
            onChange={handleCellChange}
            invalidCells={errorDetails}
          />

          <div className="button-group">
            <button
              className="btn btn-primary"
              onClick={solveSudoku}
              disabled={loading}
            >
              {loading ? t('solver.solving') : t('solver.solve')}
            </button>
            <button
              className="btn btn-secondary"
              onClick={clearBoard}
              disabled={loading}
            >
              {t('solver.clear')}
            </button>
          </div>

          <div className="button-group sample-button-group">
            {SAMPLE_PUZZLES.map((puzzle, index) => (
              <button
                key={index}
                className="btn btn-success btn-sample"
                onClick={() => loadSamplePuzzle(index)}
                disabled={loading}
              >
                {t(`samples.${puzzle.key}`)}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="board-section">
          <div className="solution-header">
            <h2 className="solution-count">
              {t('solver.solutionCount')}{' '}
              {isExactCount && numSolutions >= config.maxNumSolutions && (
                <span className="solution-count-exact">{t('solver.exactly')} </span>
              )}
              <span className="solution-count-number">{formatSolutionCount()}</span>
            </h2>
            <p className="solution-info">
              {Math.min(solutions.length, config.maxDisplaySolutions)}{t('solver.displayingSolutions')}
            </p>
          </div>

          <SudokuBoard
            board={solutions[currentSolutionIndex]}
            originalBoard={solvedFromBoard || undefined}
          />

          <div className="solution-nav">
            <button
              className="btn btn-primary btn-nav"
              onClick={handlePreviousSolution}
              disabled={currentSolutionIndex === 0}
            >
              ←
            </button>
            <span className="solution-counter">
              {t('solver.solutionCounter', { index: currentSolutionIndex + 1, total: solutions.length })}
            </span>
            <button
              className="btn btn-primary btn-nav"
              onClick={handleNextSolution}
              disabled={currentSolutionIndex === solutions.length - 1}
            >
              →
            </button>
          </div>

          <button
            className="btn btn-secondary"
            onClick={handleBackToInput}
            style={{ marginTop: '20px' }}
          >
            {t('solver.back')}
          </button>
        </div>
      )}

      {error && (
        <ErrorDisplay
          error={error}
          errorType={errorType}
          errorDetails={errorDetails}
        />
      )}

      {numSolutions === 0 && hasSolved && !loading && !error && (
        <div className="no-solution">
          <h2>{t('solver.noSolutionFound')}</h2>
          <p>{t('solver.noSolutionMessage')}</p>
        </div>
      )}
    </div>
  )
}

export default SudokuSolver
