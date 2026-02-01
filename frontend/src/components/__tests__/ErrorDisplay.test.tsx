import React from 'react'
import { screen } from '@testing-library/react'
import { renderWithI18n } from '../../__tests__/utils/i18n-test-utils'
import ErrorDisplay from '../ErrorDisplay'

describe('ErrorDisplay', () => {
  it('renders error message and label', () => {
    renderWithI18n(
      <ErrorDisplay
        error="Test error message"
        errorType="OutOfRangeError"
        errorDetails={[]}
      />
    )

    expect(screen.getByText('🔢 数値範囲エラー')).toBeInTheDocument()
    expect(screen.getByText('Test error message')).toBeInTheDocument()
  })

  it('renders error details with locations', () => {
    renderWithI18n(
      <ErrorDisplay
        error="Validation error"
        errorType="ConstraintViolation"
        errorDetails={[
          { row: 0, column: 1, number: 5 },
          { row: 2, column: 3, number: 7 },
        ]}
      />
    )

    expect(screen.getByText('⚠️ 制約違反エラー')).toBeInTheDocument()
    expect(screen.getByText('問題のある位置:')).toBeInTheDocument()
    expect(screen.getByText('行 1, 列 2: 値 5')).toBeInTheDocument()
    expect(screen.getByText('行 3, 列 4: 値 7')).toBeInTheDocument()
  })

  it('renders hint when error details exist', () => {
    renderWithI18n(
      <ErrorDisplay
        error="Constraint violation"
        errorType="ConstraintViolation"
        errorDetails={[{ row: 0, column: 0, number: 1 }]}
      />
    )

    expect(screen.getByText(/数独のルールに違反しています/)).toBeInTheDocument()
  })

  it('renders InternalServerError with hint when no details', () => {
    renderWithI18n(
      <ErrorDisplay
        error="Server error occurred"
        errorType="InternalServerError"
        errorDetails={[]}
      />
    )

    expect(screen.getByText('🔧 サーバーエラー')).toBeInTheDocument()
    expect(screen.getByText(/サーバーで予期しないエラーが発生しました/)).toBeInTheDocument()
  })

  it('renders InvalidInput error correctly', () => {
    renderWithI18n(
      <ErrorDisplay
        error="Invalid input provided"
        errorType="InvalidInput"
        errorDetails={[]}
      />
    )

    expect(screen.getByText('📝 入力エラー')).toBeInTheDocument()
    expect(screen.getByText('Invalid input provided')).toBeInTheDocument()
  })

  it('falls back to camelCase error key when primary key not found', () => {
    renderWithI18n(
      <ErrorDisplay
        error="Unknown error"
        errorType="unknownError"
        errorDetails={[{ row: 0, column: 0, number: 1 }]}
      />
    )

    // Should render without crashing, with fallback label
    expect(screen.getByText('Unknown error')).toBeInTheDocument()
  })

  it('does not show hint section when no error details and not InternalServerError', () => {
    renderWithI18n(
      <ErrorDisplay
        error="Some error"
        errorType="InvalidInput"
        errorDetails={[]}
      />
    )

    expect(screen.queryByText('問題のある位置:')).not.toBeInTheDocument()
  })

  it('applies correct CSS classes', () => {
    const { container } = renderWithI18n(
      <ErrorDisplay
        error="Error"
        errorType="OutOfRangeError"
        errorDetails={[{ row: 0, column: 0, number: 10 }]}
      />
    )

    expect(container.querySelector('.error-message')).toBeInTheDocument()
    expect(container.querySelector('.error-label')).toBeInTheDocument()
    expect(container.querySelector('.error-text')).toBeInTheDocument()
    expect(container.querySelector('.error-locations-title')).toBeInTheDocument()
    expect(container.querySelector('.error-locations')).toBeInTheDocument()
    expect(container.querySelector('.error-location-item')).toBeInTheDocument()
    expect(container.querySelector('.error-hint')).toBeInTheDocument()
  })
})
