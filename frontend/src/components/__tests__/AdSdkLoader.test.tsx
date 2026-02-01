import React from 'react'
import { render, cleanup, act } from '@testing-library/react'
import AdSdkLoader from '../AdSdkLoader'

describe('AdSdkLoader', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    // Reset window state
    delete window.admaxads
    delete window.__admaxjs
    // Remove any existing script tags
    const existingScript = document.querySelector('script[src*="adm.shinobi.jp/st/t.js"]')
    if (existingScript) {
      existingScript.remove()
    }
  })

  afterEach(() => {
    cleanup()
    jest.useRealTimers()
    delete window.admaxads
    delete window.__admaxjs
    const existingScript = document.querySelector('script[src*="adm.shinobi.jp/st/t.js"]')
    if (existingScript) {
      existingScript.remove()
    }
  })

  it('renders nothing (returns null)', () => {
    const { container } = render(<AdSdkLoader />)
    expect(container.firstChild).toBeNull()
  })

  it('initializes window.admaxads if not exists', () => {
    expect(window.admaxads).toBeUndefined()

    render(<AdSdkLoader />)

    expect(window.admaxads).toBeDefined()
    expect(Array.isArray(window.admaxads)).toBe(true)
    expect(window.admaxads).toHaveLength(0)
  })

  it('does not reset existing window.admaxads array', () => {
    window.admaxads = [{ admax_id: 'existing-ad', type: 'banner' }]

    render(<AdSdkLoader />)

    expect(window.admaxads).toHaveLength(1)
    expect(window.admaxads![0]).toEqual({ admax_id: 'existing-ad', type: 'banner' })
  })

  it('clears window.__admaxjs on mount', () => {
    window.__admaxjs = { some: 'value' }

    render(<AdSdkLoader />)

    expect(window.__admaxjs).toBeUndefined()
  })

  it('adds ad script to document head after delay', () => {
    render(<AdSdkLoader />)

    // Script should not exist immediately
    let script = document.querySelector('script[src="https://adm.shinobi.jp/st/t.js"]')
    expect(script).toBeNull()

    // Advance timers by 100ms
    act(() => {
      jest.advanceTimersByTime(100)
    })

    // Script should now exist
    script = document.querySelector('script[src="https://adm.shinobi.jp/st/t.js"]')
    expect(script).toBeInTheDocument()
    expect((script as HTMLScriptElement).async).toBe(true)
  })

  it('removes existing script before adding new one', () => {
    // Add an existing script
    const existingScript = document.createElement('script')
    existingScript.src = 'https://adm.shinobi.jp/st/t.js'
    document.head.appendChild(existingScript)

    const scriptsBefore = document.querySelectorAll('script[src*="adm.shinobi.jp/st/t.js"]')
    expect(scriptsBefore).toHaveLength(1)

    render(<AdSdkLoader />)

    // Advance timers
    act(() => {
      jest.advanceTimersByTime(100)
    })

    // Should still have only one script (old removed, new added)
    const scriptsAfter = document.querySelectorAll('script[src*="adm.shinobi.jp/st/t.js"]')
    expect(scriptsAfter).toHaveLength(1)
  })

  it('does not add script twice on StrictMode (double mount)', () => {
    const { rerender } = render(<AdSdkLoader />)

    act(() => {
      jest.advanceTimersByTime(100)
    })

    // Simulate re-render (StrictMode behavior)
    rerender(<AdSdkLoader />)

    act(() => {
      jest.advanceTimersByTime(100)
    })

    // Should still only have one script due to loadedRef guard
    const scripts = document.querySelectorAll('script[src="https://adm.shinobi.jp/st/t.js"]')
    expect(scripts).toHaveLength(1)
  })

  it('clears timeout on unmount', () => {
    const { unmount } = render(<AdSdkLoader />)

    // Unmount before timer fires
    unmount()

    // Advance timers
    act(() => {
      jest.advanceTimersByTime(100)
    })

    // Script should not be added because cleanup cleared the timeout
    const script = document.querySelector('script[src="https://adm.shinobi.jp/st/t.js"]')
    expect(script).toBeNull()
  })
})
