import React from 'react'
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react'
import InterstitialAd from '../InterstitialAd'

describe('InterstitialAd', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    document.body.innerHTML = ''
  })

  afterEach(() => {
    jest.useRealTimers()
    cleanup()
  })

  it('does not render when isOpen is false', () => {
    render(<InterstitialAd adId="test-id" isOpen={false} onClose={jest.fn()} />)

    expect(screen.queryByText('閉じる')).not.toBeInTheDocument()
    expect(screen.queryByText(/秒/)).not.toBeInTheDocument()
  })

  it('renders overlay when isOpen is true', () => {
    render(<InterstitialAd adId="test-id" isOpen={true} onClose={jest.fn()} />)

    // Should show countdown initially
    expect(screen.getByText('3秒')).toBeInTheDocument()
  })

  it('shows countdown timer starting at 3 seconds', () => {
    render(<InterstitialAd adId="test-id" isOpen={true} onClose={jest.fn()} />)

    expect(screen.getByText('3秒')).toBeInTheDocument()
  })

  it('counts down from 3 to 0', async () => {
    render(<InterstitialAd adId="test-id" isOpen={true} onClose={jest.fn()} />)

    expect(screen.getByText('3秒')).toBeInTheDocument()

    act(() => {
      jest.advanceTimersByTime(1000)
    })
    expect(screen.getByText('2秒')).toBeInTheDocument()

    act(() => {
      jest.advanceTimersByTime(1000)
    })
    expect(screen.getByText('1秒')).toBeInTheDocument()

    act(() => {
      jest.advanceTimersByTime(1000)
    })
    expect(screen.getByText('閉じる')).toBeInTheDocument()
  })

  it('disables close button during countdown', () => {
    render(<InterstitialAd adId="test-id" isOpen={true} onClose={jest.fn()} />)

    const button = screen.getByText('3秒')
    expect(button).toBeDisabled()
  })

  it('enables close button after countdown', () => {
    render(<InterstitialAd adId="test-id" isOpen={true} onClose={jest.fn()} />)

    act(() => {
      jest.advanceTimersByTime(3000)
    })

    const button = screen.getByText('閉じる')
    expect(button).not.toBeDisabled()
  })

  it('calls onClose when close button is clicked after countdown', () => {
    const onClose = jest.fn()
    render(<InterstitialAd adId="test-id" isOpen={true} onClose={onClose} />)

    act(() => {
      jest.advanceTimersByTime(3000)
    })

    const button = screen.getByText('閉じる')
    fireEvent.click(button)

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('does not call onClose when clicking disabled button', () => {
    const onClose = jest.fn()
    render(<InterstitialAd adId="test-id" isOpen={true} onClose={onClose} />)

    const button = screen.getByText('3秒')
    fireEvent.click(button)

    expect(onClose).not.toHaveBeenCalled()
  })

  it('creates ad ins element with correct data-admax-id', () => {
    const testAdId = '4f3e88c41850ab88c16d7a485c3ed7fd'
    const { container } = render(
      <InterstitialAd adId={testAdId} isOpen={true} onClose={jest.fn()} />
    )

    const ins = container.querySelector('ins.admax-ads')
    expect(ins).toBeInTheDocument()
    expect(ins?.getAttribute('data-admax-id')).toBe(testAdId)
  })

  it('resets countdown when reopened', () => {
    const { rerender } = render(
      <InterstitialAd adId="test-id" isOpen={true} onClose={jest.fn()} />
    )

    // Advance past countdown
    act(() => {
      jest.advanceTimersByTime(3000)
    })
    expect(screen.getByText('閉じる')).toBeInTheDocument()

    // Close
    rerender(<InterstitialAd adId="test-id" isOpen={false} onClose={jest.fn()} />)

    // Reopen - countdown should reset
    rerender(<InterstitialAd adId="test-id" isOpen={true} onClose={jest.fn()} />)
    expect(screen.getByText('3秒')).toBeInTheDocument()
  })

  it('has fixed position overlay styles', () => {
    const { container } = render(
      <InterstitialAd adId="test-id" isOpen={true} onClose={jest.fn()} />
    )

    const overlay = container.firstChild as HTMLElement
    expect(overlay.style.position).toBe('fixed')
    expect(overlay.style.top).toBe('0px')
    expect(overlay.style.left).toBe('0px')
    expect(overlay.style.right).toBe('0px')
    expect(overlay.style.bottom).toBe('0px')
  })

  it('has high z-index for overlay', () => {
    const { container } = render(
      <InterstitialAd adId="test-id" isOpen={true} onClose={jest.fn()} />
    )

    const overlay = container.firstChild as HTMLElement
    expect(overlay.style.zIndex).toBe('9999')
  })
})
