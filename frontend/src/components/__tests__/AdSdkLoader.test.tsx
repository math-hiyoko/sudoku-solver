import React from 'react'
import { render, act } from '@testing-library/react'
import AdSdkLoader from '../AdSdkLoader'

describe('AdSdkLoader', () => {
  beforeEach(() => {
    // Reset window state
    delete window.admaxads
    delete window.__admaxjs
    // Remove any existing scripts
    document.querySelectorAll('script[src*="adm.shinobi.jp"]').forEach(el => el.remove())
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('renders null (no visible output)', () => {
    const { container } = render(<AdSdkLoader />)
    expect(container.firstChild).toBeNull()
  })

  it('initializes admaxads array if not exists', () => {
    expect(window.admaxads).toBeUndefined()
    render(<AdSdkLoader />)
    expect(window.admaxads).toEqual([])
  })

  it('does not overwrite existing admaxads array', () => {
    window.admaxads = [{ admax_id: 'existing', type: 'banner' }]
    render(<AdSdkLoader />)
    expect(window.admaxads).toEqual([{ admax_id: 'existing', type: 'banner' }])
  })

  it('clears __admaxjs global variable', () => {
    window.__admaxjs = { some: 'data' }
    render(<AdSdkLoader />)
    expect(window.__admaxjs).toBeUndefined()
  })

  it('removes existing admax script before adding new one', () => {
    // Add an existing script
    const existingScript = document.createElement('script')
    existingScript.src = 'https://adm.shinobi.jp/st/t.js'
    document.head.appendChild(existingScript)
    expect(document.querySelector('script[src*="adm.shinobi.jp/st/t.js"]')).not.toBeNull()

    render(<AdSdkLoader />)

    // After 100ms, new script should be added
    act(() => {
      jest.advanceTimersByTime(100)
    })

    const scripts = document.querySelectorAll('script[src*="adm.shinobi.jp/st/t.js"]')
    expect(scripts.length).toBe(1)
  })

  it('loads script after 100ms delay', () => {
    render(<AdSdkLoader />)

    // Script should not be added immediately
    expect(document.querySelector('script[src="https://adm.shinobi.jp/st/t.js"]')).toBeNull()

    // After 100ms, script should be added
    act(() => {
      jest.advanceTimersByTime(100)
    })

    const script = document.querySelector('script[src="https://adm.shinobi.jp/st/t.js"]') as HTMLScriptElement
    expect(script).not.toBeNull()
    expect(script.async).toBe(true)
  })

  it('clears timeout on unmount', () => {
    const { unmount } = render(<AdSdkLoader />)

    // Unmount before timeout fires
    unmount()

    // Advance timers
    act(() => {
      jest.advanceTimersByTime(100)
    })

    // Script should not be added because component was unmounted
    expect(document.querySelector('script[src="https://adm.shinobi.jp/st/t.js"]')).toBeNull()
  })

  it('does not load script twice in StrictMode', () => {
    // Simulate StrictMode double-mount
    const { rerender } = render(<AdSdkLoader />)

    act(() => {
      jest.advanceTimersByTime(100)
    })

    // Re-render (simulating StrictMode behavior)
    rerender(<AdSdkLoader />)

    act(() => {
      jest.advanceTimersByTime(100)
    })

    // Should only have one script
    const scripts = document.querySelectorAll('script[src="https://adm.shinobi.jp/st/t.js"]')
    expect(scripts.length).toBe(1)
  })
})
