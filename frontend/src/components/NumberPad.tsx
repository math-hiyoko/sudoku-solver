import React, { useState, useCallback } from 'react'

interface NumberPadProps {
  onNumberSelect: (value: number | null) => void
  disabled?: boolean
  selectedCell?: { row: number; col: number } | null
}

const NumberPad: React.FC<NumberPadProps> = ({
  onNumberSelect,
  disabled = false,
  selectedCell
}) => {
  const [pressedNumber, setPressedNumber] = useState<number | 'clear' | null>(null)

  const handleButtonPress = useCallback((value: number | null) => {
    setPressedNumber(value === null ? 'clear' : value)
    onNumberSelect(value)
    setTimeout(() => setPressedNumber(null), 150)
  }, [onNumberSelect])

  const getButtonStyle = useCallback((num: number | 'clear') => ({
    width: '60px',
    height: '60px',
    fontSize: num === 'clear' ? '16px' : '24px',
    fontWeight: '700' as const,
    backgroundColor: num === 'clear' ? '#6c757d' : '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: disabled || !selectedCell ? 'not-allowed' : 'pointer',
    opacity: disabled || !selectedCell ? 0.5 : 1,
    WebkitTapHighlightColor: 'transparent',
    touchAction: 'manipulation' as const,
    userSelect: 'none' as const,
    transform: pressedNumber === num ? 'scale(0.95)' : 'scale(1)',
    transition: 'transform 0.1s ease-in-out',
  }), [disabled, selectedCell, pressedNumber])

  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]

  return (
    <div
      className="number-pad-container"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        padding: '15px',
        boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.1)',
        zIndex: 100,
      }}
    >
      {/* セル選択のヒント */}
      <div style={{
        textAlign: 'center',
        marginBottom: '10px',
        fontSize: '14px',
        color: selectedCell ? '#007bff' : '#999',
      }}>
        {selectedCell
          ? `選択中: ${selectedCell.row + 1}行 ${selectedCell.col + 1}列`
          : 'セルをタップして選択してください'
        }
      </div>

      {/* 3x3の数字ボタングリッド */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 60px)',
        gap: '10px',
        justifyContent: 'center',
        marginBottom: '10px',
      }}>
        {numbers.map((num) => (
          <button
            key={num}
            onClick={() => handleButtonPress(num)}
            disabled={disabled || !selectedCell}
            style={getButtonStyle(num)}
            aria-label={`数字${num}を入力`}
          >
            {num}
          </button>
        ))}
      </div>

      {/* クリアボタン */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
      }}>
        <button
          onClick={() => handleButtonPress(null)}
          disabled={disabled || !selectedCell}
          style={{
            ...getButtonStyle('clear'),
            width: '200px',
          }}
          aria-label="セルをクリア"
        >
          クリア
        </button>
      </div>
    </div>
  )
}

export default NumberPad
