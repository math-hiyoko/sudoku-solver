import React from 'react'
import { render, cleanup } from '@testing-library/react'
import AdMax from '../AdMax'

describe('AdMax', () => {
  beforeEach(() => {
    // Clean up DOM before each test
    document.body.innerHTML = ''
  })

  afterEach(() => {
    cleanup()
  })

  it('renders a container div', () => {
    const { container } = render(<AdMax adId="test-ad-id" />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('creates a script element with correct src', () => {
    const testAdId = '8dc91f046104d62a27c2b4beb41ee218'
    const { container } = render(<AdMax adId={testAdId} />)

    const script = container.querySelector('script')
    expect(script).toBeInTheDocument()
    expect(script?.src).toBe(`https://adm.shinobi.jp/s/${testAdId}`)
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

  it('updates script when adId changes', () => {
    const { container, rerender } = render(<AdMax adId="first-id" />)

    let script = container.querySelector('script')
    expect(script?.src).toContain('first-id')

    rerender(<AdMax adId="second-id" />)

    script = container.querySelector('script')
    expect(script?.src).toContain('second-id')
  })

  it('cleans up script on unmount', () => {
    const { container, unmount } = render(<AdMax adId="test-id" />)

    expect(container.querySelector('script')).toBeInTheDocument()

    unmount()

    // After unmount, the container should be empty
    expect(container.querySelector('script')).not.toBeInTheDocument()
  })
})
