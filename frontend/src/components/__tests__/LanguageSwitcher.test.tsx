import React from 'react'
import { screen, fireEvent } from '@testing-library/react'
import { renderWithI18n } from '../../__tests__/utils/i18n-test-utils'
import LanguageSwitcher from '../LanguageSwitcher'

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    // Clear localStorage mock before each test
    jest.clearAllMocks()
  })

  it('renders all language buttons', () => {
    renderWithI18n(<LanguageSwitcher />)

    expect(screen.getByRole('button', { name: 'Switch to English' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Switch to French' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Switch to Chinese' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Switch to Japanese' })).toBeInTheDocument()
  })

  it('displays correct button labels', () => {
    renderWithI18n(<LanguageSwitcher />)

    expect(screen.getByText('EN')).toBeInTheDocument()
    expect(screen.getByText('FR')).toBeInTheDocument()
    expect(screen.getByText('中文')).toBeInTheDocument()
    expect(screen.getByText('日本語')).toBeInTheDocument()
  })

  it('highlights the current language button (English)', () => {
    renderWithI18n(<LanguageSwitcher />, { language: 'en' })

    const enButton = screen.getByRole('button', { name: 'Switch to English' })
    const frButton = screen.getByRole('button', { name: 'Switch to French' })

    expect(enButton).toHaveStyle({ fontWeight: '700', backgroundColor: '#007bff' })
    expect(frButton).toHaveStyle({ fontWeight: '400', backgroundColor: '#f0f0f0' })
  })

  it('highlights the current language button (Japanese)', () => {
    renderWithI18n(<LanguageSwitcher />, { language: 'ja' })

    const jaButton = screen.getByRole('button', { name: 'Switch to Japanese' })
    const enButton = screen.getByRole('button', { name: 'Switch to English' })

    expect(jaButton).toHaveStyle({ fontWeight: '700', backgroundColor: '#007bff' })
    expect(enButton).toHaveStyle({ fontWeight: '400', backgroundColor: '#f0f0f0' })
  })

  it('changes language when button is clicked', () => {
    const { i18n } = renderWithI18n(<LanguageSwitcher />, { language: 'en' })

    expect(i18n.language).toBe('en')

    const frButton = screen.getByRole('button', { name: 'Switch to French' })
    fireEvent.click(frButton)

    expect(i18n.language).toBe('fr')
  })

  it('saves language to localStorage when changed', () => {
    renderWithI18n(<LanguageSwitcher />, { language: 'en' })

    const zhButton = screen.getByRole('button', { name: 'Switch to Chinese' })
    fireEvent.click(zhButton)

    expect(localStorage.setItem).toHaveBeenCalledWith('language', 'zh')
  })

  it('updates document language attribute when language is changed', () => {
    renderWithI18n(<LanguageSwitcher />, { language: 'en' })

    const jaButton = screen.getByRole('button', { name: 'Switch to Japanese' })
    fireEvent.click(jaButton)

    expect(document.documentElement.lang).toBe('ja')
  })

  it('allows switching between all 4 languages', () => {
    const { i18n } = renderWithI18n(<LanguageSwitcher />, { language: 'en' })

    // Start with English
    expect(i18n.language).toBe('en')

    // Switch to French
    fireEvent.click(screen.getByRole('button', { name: 'Switch to French' }))
    expect(i18n.language).toBe('fr')

    // Switch to Chinese
    fireEvent.click(screen.getByRole('button', { name: 'Switch to Chinese' }))
    expect(i18n.language).toBe('zh')

    // Switch to Japanese
    fireEvent.click(screen.getByRole('button', { name: 'Switch to Japanese' }))
    expect(i18n.language).toBe('ja')

    // Switch back to English
    fireEvent.click(screen.getByRole('button', { name: 'Switch to English' }))
    expect(i18n.language).toBe('en')
  })

  it('has correct styling for language switcher container', () => {
    renderWithI18n(<LanguageSwitcher />)

    const container = screen.getByRole('button', { name: 'Switch to English' }).parentElement

    expect(container).toHaveStyle({
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: '1000',
    })
  })

  describe('Default language', () => {
    it('defaults to English when no language is specified', () => {
      const { i18n } = renderWithI18n(<LanguageSwitcher />)

      expect(i18n.language).toBe('en')
    })

    it('highlights English button by default', () => {
      renderWithI18n(<LanguageSwitcher />)

      const enButton = screen.getByRole('button', { name: 'Switch to English' })
      expect(enButton).toHaveStyle({ fontWeight: '700', backgroundColor: '#007bff' })
    })
  })

  describe('Language button order', () => {
    it('displays language buttons in correct order: Japanese, French, Chinese, English', () => {
      renderWithI18n(<LanguageSwitcher />)

      const allButtons = screen.getAllByRole('button')

      expect(allButtons).toHaveLength(4)
      expect(allButtons[0]).toHaveAttribute('aria-label', 'Switch to Japanese')
      expect(allButtons[1]).toHaveAttribute('aria-label', 'Switch to French')
      expect(allButtons[2]).toHaveAttribute('aria-label', 'Switch to Chinese')
      expect(allButtons[3]).toHaveAttribute('aria-label', 'Switch to English')
    })

    it('displays language labels in correct order', () => {
      renderWithI18n(<LanguageSwitcher />)

      const allButtons = screen.getAllByRole('button')

      expect(allButtons[0]).toHaveTextContent('日本語')
      expect(allButtons[1]).toHaveTextContent('FR')
      expect(allButtons[2]).toHaveTextContent('中文')
      expect(allButtons[3]).toHaveTextContent('EN')
    })

    it('maintains correct order across different starting languages', () => {
      const languages = ['en', 'fr', 'zh', 'ja']

      languages.forEach((lang) => {
        const { unmount } = renderWithI18n(<LanguageSwitcher />, { language: lang })

        const allButtons = screen.getAllByRole('button')
        expect(allButtons[0]).toHaveAttribute('aria-label', 'Switch to Japanese')
        expect(allButtons[1]).toHaveAttribute('aria-label', 'Switch to French')
        expect(allButtons[2]).toHaveAttribute('aria-label', 'Switch to Chinese')
        expect(allButtons[3]).toHaveAttribute('aria-label', 'Switch to English')

        unmount()
      })
    })
  })
})
