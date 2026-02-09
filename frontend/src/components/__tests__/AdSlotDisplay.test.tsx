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

  it('renders ad container with correct data-admax-id for switch ad', () => {
    const { container } = render(<AdSlotDisplay />)
    const adDiv = container.querySelector('.admax-switch')

    expect(adDiv).toBeInTheDocument()
    expect(adDiv).toHaveAttribute('data-admax-id', '326c6aae086754fcb0952b2dfa0c91f6')
  })

  it('applies correct inline styles', () => {
    const { container } = render(<AdSlotDisplay />)
    const adDiv = container.querySelector('.admax-switch') as HTMLElement

    expect(adDiv.style.display).toBe('inline-block')
  })

  it('initializes window.admaxads if not exists', () => {
    expect(window.admaxads).toBeUndefined()

    render(<AdSlotDisplay />)

    expect(window.admaxads).toBeDefined()
    expect(Array.isArray(window.admaxads)).toBe(true)
  })

  it('pushes both switch and action ad info to window.admaxads', () => {
    render(<AdSlotDisplay />)

    expect(window.admaxads).toHaveLength(2)
    expect(window.admaxads![0]).toEqual({
      admax_id: '326c6aae086754fcb0952b2dfa0c91f6',
      type: 'switch'
    })
    expect(window.admaxads![1]).toEqual({
      admax_id: '4f3e88c41850ab88c16d7a485c3ed7fd',
      type: 'action'
    })
  })

  it('does not push duplicate when already pushed (StrictMode protection)', () => {
    const { rerender } = render(<AdSlotDisplay />)

    // Simulate StrictMode double-render by re-rendering
    rerender(<AdSlotDisplay />)

    // Should still only have two entries due to pushedRef guard
    expect(window.admaxads).toHaveLength(2)
  })

  it('appends to existing window.admaxads array', () => {
    window.admaxads = [{ admax_id: 'existing-ad', type: 'banner' }]

    render(<AdSlotDisplay />)

    expect(window.admaxads).toHaveLength(3)
    expect(window.admaxads![0]).toEqual({ admax_id: 'existing-ad', type: 'banner' })
    expect(window.admaxads![1]).toEqual({ admax_id: '326c6aae086754fcb0952b2dfa0c91f6', type: 'switch' })
    expect(window.admaxads![2]).toEqual({ admax_id: '4f3e88c41850ab88c16d7a485c3ed7fd', type: 'action' })
  })
})
