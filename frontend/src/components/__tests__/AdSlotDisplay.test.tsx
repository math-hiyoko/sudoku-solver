import React from 'react'
import { render, cleanup } from '@testing-library/react'
import AdSlotDisplay from '../AdSlotDisplay'

describe('AdSlotDisplay', () => {
  beforeEach(() => {
    // Reset window.admaxads before each test
    delete window.admaxads
  })

  afterEach(() => {
    cleanup()
    delete window.admaxads
  })

  it('renders ad container with correct data-admax-id', () => {
    const { container } = render(<AdSlotDisplay admaxId="test-ad-123" />)
    const adDiv = container.querySelector('.admax-switch')

    expect(adDiv).toBeInTheDocument()
    expect(adDiv).toHaveAttribute('data-admax-id', 'test-ad-123')
  })

  it('applies correct inline styles', () => {
    const { container } = render(<AdSlotDisplay admaxId="test-ad-123" />)
    const adDiv = container.querySelector('.admax-switch') as HTMLElement

    expect(adDiv.style.display).toBe('inline-block')
  })

  it('initializes window.admaxads if not exists', () => {
    expect(window.admaxads).toBeUndefined()

    render(<AdSlotDisplay admaxId="test-ad-123" />)

    expect(window.admaxads).toBeDefined()
    expect(Array.isArray(window.admaxads)).toBe(true)
  })

  it('pushes ad info to window.admaxads', () => {
    render(<AdSlotDisplay admaxId="test-ad-123" />)

    expect(window.admaxads).toHaveLength(1)
    expect(window.admaxads![0]).toEqual({
      admax_id: 'test-ad-123',
      type: 'switch'
    })
  })

  it('does not push duplicate when already pushed (StrictMode protection)', () => {
    const { rerender } = render(<AdSlotDisplay admaxId="test-ad-123" />)

    // Simulate StrictMode double-render by re-rendering
    rerender(<AdSlotDisplay admaxId="test-ad-123" />)

    // Should still only have one entry due to pushedRef guard
    expect(window.admaxads).toHaveLength(1)
  })

  it('appends to existing window.admaxads array', () => {
    window.admaxads = [{ admax_id: 'existing-ad', type: 'banner' }]

    render(<AdSlotDisplay admaxId="test-ad-123" />)

    expect(window.admaxads).toHaveLength(2)
    expect(window.admaxads![0]).toEqual({ admax_id: 'existing-ad', type: 'banner' })
    expect(window.admaxads![1]).toEqual({ admax_id: 'test-ad-123', type: 'switch' })
  })

  it('renders multiple ad slots independently', () => {
    const { container } = render(
      <>
        <AdSlotDisplay admaxId="ad-1" />
        <AdSlotDisplay admaxId="ad-2" />
      </>
    )

    const adDivs = container.querySelectorAll('.admax-switch')
    expect(adDivs).toHaveLength(2)
    expect(adDivs[0]).toHaveAttribute('data-admax-id', 'ad-1')
    expect(adDivs[1]).toHaveAttribute('data-admax-id', 'ad-2')

    expect(window.admaxads).toHaveLength(2)
  })
})
