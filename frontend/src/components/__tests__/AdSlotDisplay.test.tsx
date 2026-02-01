import React, { createRef } from 'react'
import { render } from '@testing-library/react'
import AdSlotDisplay from '../AdSlotDisplay'

describe('AdSlotDisplay', () => {
  beforeEach(() => {
    // Reset window state
    delete window.admaxads
  })

  it('renders with correct data-admax-id attribute', () => {
    const { container } = render(
      <AdSlotDisplay admaxId="test-ad-id" maxWidth={728} height={90} />
    )

    const adSlot = container.querySelector('[data-admax-id="test-ad-id"]')
    expect(adSlot).toBeInTheDocument()
  })

  it('renders with admax-ads class', () => {
    const { container } = render(
      <AdSlotDisplay admaxId="test-ad-id" maxWidth={728} height={90} />
    )

    const adSlot = container.querySelector('.admax-ads')
    expect(adSlot).toBeInTheDocument()
  })

  it('applies correct styles for PC banner', () => {
    const { container } = render(
      <AdSlotDisplay admaxId="test-ad-id" maxWidth={728} height={90} />
    )

    const adSlot = container.querySelector('.admax-ads') as HTMLElement
    expect(adSlot.style.display).toBe('inline-block')
    expect(adSlot.style.width).toBe('100%')
    expect(adSlot.style.maxWidth).toBe('728px')
    expect(adSlot.style.height).toBe('90px')
  })

  it('applies correct styles for mobile banner', () => {
    const { container } = render(
      <AdSlotDisplay admaxId="mobile-ad-id" maxWidth={320} height={50} />
    )

    const adSlot = container.querySelector('.admax-ads') as HTMLElement
    expect(adSlot.style.maxWidth).toBe('320px')
    expect(adSlot.style.height).toBe('50px')
  })

  it('initializes admaxads array and pushes ad config', () => {
    expect(window.admaxads).toBeUndefined()

    render(<AdSlotDisplay admaxId="test-ad-id" maxWidth={728} height={90} />)

    expect(window.admaxads).toEqual([
      { admax_id: 'test-ad-id', type: 'banner' }
    ])
  })

  it('appends to existing admaxads array', () => {
    window.admaxads = [{ admax_id: 'existing-ad', type: 'banner' }]

    render(<AdSlotDisplay admaxId="new-ad-id" maxWidth={728} height={90} />)

    expect(window.admaxads).toEqual([
      { admax_id: 'existing-ad', type: 'banner' },
      { admax_id: 'new-ad-id', type: 'banner' }
    ])
  })

  it('does not push duplicate ad config in StrictMode', () => {
    const { rerender } = render(
      <AdSlotDisplay admaxId="test-ad-id" maxWidth={728} height={90} />
    )

    // Re-render (simulating StrictMode behavior)
    rerender(<AdSlotDisplay admaxId="test-ad-id" maxWidth={728} height={90} />)

    // Should only have one entry
    expect(window.admaxads?.length).toBe(1)
  })

  it('supports forwardRef', () => {
    const ref = createRef<HTMLDivElement>()

    render(<AdSlotDisplay ref={ref} admaxId="test-ad-id" maxWidth={728} height={90} />)

    expect(ref.current).toBeInstanceOf(HTMLDivElement)
    expect(ref.current?.getAttribute('data-admax-id')).toBe('test-ad-id')
  })

  it('has correct displayName', () => {
    expect(AdSlotDisplay.displayName).toBe('AdSlotDisplay')
  })
})
