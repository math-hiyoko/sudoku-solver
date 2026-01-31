import React from 'react'
import { render, cleanup } from '@testing-library/react'
import AdMax from '../AdMax'

declare global {
  interface Window {
    admaxads?: Array<{ admax_id: string; type: string }>
  }
}

describe('AdMax', () => {
  beforeEach(() => {
    // Clean up DOM and global state before each test
    document.body.innerHTML = ''
    window.admaxads = undefined
    // Remove any existing admax scripts
    document.querySelectorAll('script[src="https://adm.shinobi.jp/st/t.js"]').forEach(el => el.remove())
  })

  afterEach(() => {
    cleanup()
  })

  it('renders a container div', () => {
    const { container } = render(<AdMax adId="test-ad-id" />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('creates an ins element with correct data-admax-id', () => {
    const testAdId = '8dc91f046104d62a27c2b4beb41ee218'
    const { container } = render(<AdMax adId={testAdId} />)

    const ins = container.querySelector('ins.admax-ads')
    expect(ins).toBeInTheDocument()
    expect(ins?.getAttribute('data-admax-id')).toBe(testAdId)
  })

  it('pushes ad config to window.admaxads array', () => {
    const testAdId = 'test-ad-id'
    render(<AdMax adId={testAdId} />)

    expect(window.admaxads).toBeDefined()
    expect(window.admaxads).toContainEqual({ admax_id: testAdId, type: 'banner' })
  })

  it('loads the admax async script in document.body', () => {
    render(<AdMax adId="test-id" />)

    const script = document.querySelector('script[src="https://adm.shinobi.jp/st/t.js"]')
    expect(script).toBeInTheDocument()
    expect((script as HTMLScriptElement)?.async).toBe(true)
  })

  it('applies custom styles', () => {
    const customStyle = { marginTop: '20px', backgroundColor: 'red' }
    const { container } = render(<AdMax adId="test-id" style={customStyle} />)

    const div = container.firstChild as HTMLElement
    expect(div.style.marginTop).toBe('20px')
    expect(div.style.backgroundColor).toBe('red')
  })

  it('has centered content styles by default', () => {
    const { container } = render(<AdMax adId="test-id" />)

    const div = container.firstChild as HTMLElement
    expect(div.style.display).toBe('flex')
    expect(div.style.justifyContent).toBe('center')
    expect(div.style.alignItems).toBe('center')
  })

  it('updates ins element when adId changes', () => {
    const { container, rerender } = render(<AdMax adId="first-id" />)

    let ins = container.querySelector('ins.admax-ads')
    expect(ins?.getAttribute('data-admax-id')).toBe('first-id')

    rerender(<AdMax adId="second-id" />)

    ins = container.querySelector('ins.admax-ads')
    expect(ins?.getAttribute('data-admax-id')).toBe('second-id')
  })

  it('cleans up ins element on unmount', () => {
    const { container, unmount } = render(<AdMax adId="test-id" />)

    expect(container.querySelector('ins.admax-ads')).toBeInTheDocument()

    unmount()

    // After unmount, the container should be empty
    expect(container.querySelector('ins.admax-ads')).not.toBeInTheDocument()
  })
})
