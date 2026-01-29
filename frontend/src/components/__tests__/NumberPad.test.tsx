import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import NumberPad from '../NumberPad'

describe('NumberPad', () => {
  const mockOnNumberSelect = jest.fn()

  beforeEach(() => {
    mockOnNumberSelect.mockClear()
  })

  it('renders all number buttons (1-9)', () => {
    render(
      <NumberPad
        onNumberSelect={mockOnNumberSelect}
        selectedCell={{ row: 0, col: 0 }}
      />
    )

    for (let i = 1; i <= 9; i++) {
      expect(screen.getByRole('button', { name: `数字${i}を入力` })).toBeInTheDocument()
    }
  })

  it('renders clear button', () => {
    render(
      <NumberPad
        onNumberSelect={mockOnNumberSelect}
        selectedCell={{ row: 0, col: 0 }}
      />
    )

    expect(screen.getByRole('button', { name: 'セルをクリア' })).toBeInTheDocument()
  })

  it('calls onNumberSelect with correct number when button is clicked', () => {
    render(
      <NumberPad
        onNumberSelect={mockOnNumberSelect}
        selectedCell={{ row: 0, col: 0 }}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: '数字5を入力' }))
    expect(mockOnNumberSelect).toHaveBeenCalledWith(5)
  })

  it('calls onNumberSelect with null when clear button is clicked', () => {
    render(
      <NumberPad
        onNumberSelect={mockOnNumberSelect}
        selectedCell={{ row: 0, col: 0 }}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: 'セルをクリア' }))
    expect(mockOnNumberSelect).toHaveBeenCalledWith(null)
  })

  it('disables buttons when disabled prop is true', () => {
    render(
      <NumberPad
        onNumberSelect={mockOnNumberSelect}
        disabled={true}
        selectedCell={{ row: 0, col: 0 }}
      />
    )

    const button = screen.getByRole('button', { name: '数字1を入力' })
    expect(button).toBeDisabled()
  })

  it('disables buttons when no cell is selected', () => {
    render(
      <NumberPad
        onNumberSelect={mockOnNumberSelect}
        selectedCell={null}
      />
    )

    const button = screen.getByRole('button', { name: '数字1を入力' })
    expect(button).toBeDisabled()
  })

  it('shows hint text when no cell is selected', () => {
    render(
      <NumberPad
        onNumberSelect={mockOnNumberSelect}
        selectedCell={null}
      />
    )

    expect(screen.getByText('セルをタップして選択してください')).toBeInTheDocument()
  })

  it('shows selected cell info when cell is selected', () => {
    render(
      <NumberPad
        onNumberSelect={mockOnNumberSelect}
        selectedCell={{ row: 2, col: 5 }}
      />
    )

    expect(screen.getByText('選択中: 3行 6列')).toBeInTheDocument()
  })

  it('does not call onNumberSelect when disabled', () => {
    render(
      <NumberPad
        onNumberSelect={mockOnNumberSelect}
        disabled={true}
        selectedCell={{ row: 0, col: 0 }}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: '数字5を入力' }))
    expect(mockOnNumberSelect).not.toHaveBeenCalled()
  })

  it('does not call onNumberSelect when no cell is selected', () => {
    render(
      <NumberPad
        onNumberSelect={mockOnNumberSelect}
        selectedCell={null}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: '数字5を入力' }))
    expect(mockOnNumberSelect).not.toHaveBeenCalled()
  })
})
