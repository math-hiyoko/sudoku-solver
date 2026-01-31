import React from 'react'
import { screen, fireEvent } from '@testing-library/react'
import { renderWithI18n } from '../../__tests__/utils/i18n-test-utils'
import NumberPad from '../NumberPad'

describe('NumberPad', () => {
  const mockOnNumberSelect = jest.fn()

  beforeEach(() => {
    mockOnNumberSelect.mockClear()
  })

  describe('Rendering with different languages', () => {
    it('renders all number buttons (1-9) in Japanese', () => {
      renderWithI18n(
        <NumberPad
          onNumberSelect={mockOnNumberSelect}
          selectedCell={{ row: 0, col: 0 }}
        />,
        { language: 'ja' }
      )

      for (let i = 1; i <= 9; i++) {
        expect(screen.getByRole('button', { name: `数字${i}を入力` })).toBeInTheDocument()
      }
    })

    it('renders all number buttons (1-9) in English', () => {
      renderWithI18n(
        <NumberPad
          onNumberSelect={mockOnNumberSelect}
          selectedCell={{ row: 0, col: 0 }}
        />,
        { language: 'en' }
      )

      for (let i = 1; i <= 9; i++) {
        expect(screen.getByRole('button', { name: `Input number ${i}` })).toBeInTheDocument()
      }
    })

    it('renders clear button in Japanese', () => {
      renderWithI18n(
        <NumberPad
          onNumberSelect={mockOnNumberSelect}
          selectedCell={{ row: 0, col: 0 }}
        />,
        { language: 'ja' }
      )

      expect(screen.getByRole('button', { name: 'セルをクリア' })).toBeInTheDocument()
      expect(screen.getByText('クリア')).toBeInTheDocument()
    })

    it('renders clear button in English', () => {
      renderWithI18n(
        <NumberPad
          onNumberSelect={mockOnNumberSelect}
          selectedCell={{ row: 0, col: 0 }}
        />,
        { language: 'en' }
      )

      expect(screen.getByRole('button', { name: 'Clear cell' })).toBeInTheDocument()
      expect(screen.getByText('Clear')).toBeInTheDocument()
    })
  })

  describe('Functionality', () => {
    it('calls onNumberSelect with correct number when button is clicked', () => {
      renderWithI18n(
        <NumberPad
          onNumberSelect={mockOnNumberSelect}
          selectedCell={{ row: 0, col: 0 }}
        />,
        { language: 'en' }
      )

      fireEvent.click(screen.getByRole('button', { name: 'Input number 5' }))
      expect(mockOnNumberSelect).toHaveBeenCalledWith(5)
    })

    it('calls onNumberSelect with null when clear button is clicked', () => {
      renderWithI18n(
        <NumberPad
          onNumberSelect={mockOnNumberSelect}
          selectedCell={{ row: 0, col: 0 }}
        />,
        { language: 'en' }
      )

      fireEvent.click(screen.getByRole('button', { name: 'Clear cell' }))
      expect(mockOnNumberSelect).toHaveBeenCalledWith(null)
    })

    it('disables buttons when disabled prop is true', () => {
      renderWithI18n(
        <NumberPad
          onNumberSelect={mockOnNumberSelect}
          disabled={true}
          selectedCell={{ row: 0, col: 0 }}
        />,
        { language: 'en' }
      )

      const button = screen.getByRole('button', { name: 'Input number 1' })
      expect(button).toBeDisabled()
    })

    it('disables buttons when no cell is selected', () => {
      renderWithI18n(
        <NumberPad
          onNumberSelect={mockOnNumberSelect}
          selectedCell={null}
        />,
        { language: 'en' }
      )

      const button = screen.getByRole('button', { name: 'Input number 1' })
      expect(button).toBeDisabled()
    })

    it('does not call onNumberSelect when disabled', () => {
      renderWithI18n(
        <NumberPad
          onNumberSelect={mockOnNumberSelect}
          disabled={true}
          selectedCell={{ row: 0, col: 0 }}
        />,
        { language: 'en' }
      )

      fireEvent.click(screen.getByRole('button', { name: 'Input number 5' }))
      expect(mockOnNumberSelect).not.toHaveBeenCalled()
    })

    it('does not call onNumberSelect when no cell is selected', () => {
      renderWithI18n(
        <NumberPad
          onNumberSelect={mockOnNumberSelect}
          selectedCell={null}
        />,
        { language: 'en' }
      )

      fireEvent.click(screen.getByRole('button', { name: 'Input number 5' }))
      expect(mockOnNumberSelect).not.toHaveBeenCalled()
    })
  })

  describe('Cell selection display', () => {
    it('shows hint text when no cell is selected (Japanese)', () => {
      renderWithI18n(
        <NumberPad
          onNumberSelect={mockOnNumberSelect}
          selectedCell={null}
        />,
        { language: 'ja' }
      )

      expect(screen.getByText('セルをタップして選択してください')).toBeInTheDocument()
    })

    it('shows hint text when no cell is selected (English)', () => {
      renderWithI18n(
        <NumberPad
          onNumberSelect={mockOnNumberSelect}
          selectedCell={null}
        />,
        { language: 'en' }
      )

      expect(screen.getByText('Tap a cell to select')).toBeInTheDocument()
    })

    it('shows selected cell info when cell is selected (Japanese)', () => {
      renderWithI18n(
        <NumberPad
          onNumberSelect={mockOnNumberSelect}
          selectedCell={{ row: 2, col: 5 }}
        />,
        { language: 'ja' }
      )

      expect(screen.getByText('選択中: 3行 6列')).toBeInTheDocument()
    })

    it('shows selected cell info when cell is selected (English)', () => {
      renderWithI18n(
        <NumberPad
          onNumberSelect={mockOnNumberSelect}
          selectedCell={{ row: 2, col: 5 }}
        />,
        { language: 'en' }
      )

      expect(screen.getByText('Selected: Row 3 Col 6')).toBeInTheDocument()
    })
  })
})
