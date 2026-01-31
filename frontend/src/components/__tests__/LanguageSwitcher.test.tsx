import React from 'react'
import { screen, fireEvent } from '@testing-library/react'
import { renderWithI18n } from '../../__tests__/utils/i18n-test-utils'
import LanguageSwitcher from '../LanguageSwitcher'

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    // Clear localStorage mock before each test
    jest.clearAllMocks()
  })

  it('renders language selector dropdown', () => {
    renderWithI18n(<LanguageSwitcher />)

    const select = screen.getByRole('combobox', { name: 'Select language' })
    expect(select).toBeInTheDocument()
  })

  it('displays all language options', () => {
    renderWithI18n(<LanguageSwitcher />)

    expect(screen.getByRole('option', { name: /日本語/ })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: /Français/ })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: /中文/ })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: /English/ })).toBeInTheDocument()
  })

  it('shows current language as selected (English)', () => {
    renderWithI18n(<LanguageSwitcher />, { language: 'en' })

    const select = screen.getByRole('combobox', { name: 'Select language' }) as HTMLSelectElement
    expect(select.value).toBe('en')
  })

  it('shows current language as selected (Japanese)', () => {
    renderWithI18n(<LanguageSwitcher />, { language: 'ja' })

    const select = screen.getByRole('combobox', { name: 'Select language' }) as HTMLSelectElement
    expect(select.value).toBe('ja')
  })

  it('changes language when option is selected', () => {
    const { i18n } = renderWithI18n(<LanguageSwitcher />, { language: 'en' })

    expect(i18n.language).toBe('en')

    const select = screen.getByRole('combobox', { name: 'Select language' })
    fireEvent.change(select, { target: { value: 'fr' } })

    expect(i18n.language).toBe('fr')
  })

  it('saves language to localStorage when changed', () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem')
    renderWithI18n(<LanguageSwitcher />, { language: 'en' })

    const select = screen.getByRole('combobox', { name: 'Select language' })
    fireEvent.change(select, { target: { value: 'zh' } })

    expect(setItemSpy).toHaveBeenCalledWith('language', 'zh')
    setItemSpy.mockRestore()
  })

  it('updates document language attribute when language is changed', () => {
    renderWithI18n(<LanguageSwitcher />, { language: 'en' })

    const select = screen.getByRole('combobox', { name: 'Select language' })
    fireEvent.change(select, { target: { value: 'ja' } })

    expect(document.documentElement.lang).toBe('ja')
  })

  it('allows switching between all 4 languages', () => {
    const { i18n } = renderWithI18n(<LanguageSwitcher />, { language: 'en' })

    const select = screen.getByRole('combobox', { name: 'Select language' })

    // Start with English
    expect(i18n.language).toBe('en')

    // Switch to French
    fireEvent.change(select, { target: { value: 'fr' } })
    expect(i18n.language).toBe('fr')

    // Switch to Chinese
    fireEvent.change(select, { target: { value: 'zh' } })
    expect(i18n.language).toBe('zh')

    // Switch to Japanese
    fireEvent.change(select, { target: { value: 'ja' } })
    expect(i18n.language).toBe('ja')

    // Switch back to English
    fireEvent.change(select, { target: { value: 'en' } })
    expect(i18n.language).toBe('en')
  })

  it('has correct styling for language switcher container', () => {
    renderWithI18n(<LanguageSwitcher />)

    const select = screen.getByRole('combobox', { name: 'Select language' })
    const container = select.parentElement

    expect(container).toHaveStyle({
      position: 'fixed',
      top: '10px',
      right: '10px',
      zIndex: '1000',
    })
  })

  describe('Default language', () => {
    it('defaults to English when no language is specified', () => {
      const { i18n } = renderWithI18n(<LanguageSwitcher />)

      expect(i18n.language).toBe('en')
    })

    it('shows English as selected by default', () => {
      renderWithI18n(<LanguageSwitcher />)

      const select = screen.getByRole('combobox', { name: 'Select language' }) as HTMLSelectElement
      expect(select.value).toBe('en')
    })
  })

  describe('Language option order', () => {
    it('displays language options in correct order: Japanese, French, Chinese, English', () => {
      renderWithI18n(<LanguageSwitcher />)

      const options = screen.getAllByRole('option')

      expect(options).toHaveLength(4)
      expect(options[0]).toHaveValue('ja')
      expect(options[1]).toHaveValue('fr')
      expect(options[2]).toHaveValue('zh')
      expect(options[3]).toHaveValue('en')
    })

    it('displays language labels with flags in correct order', () => {
      renderWithI18n(<LanguageSwitcher />)

      const options = screen.getAllByRole('option')

      expect(options[0]).toHaveTextContent('🇯🇵 日本語')
      expect(options[1]).toHaveTextContent('🇫🇷 Français')
      expect(options[2]).toHaveTextContent('🇨🇳 中文')
      expect(options[3]).toHaveTextContent('🇬🇧 English')
    })

    it('maintains correct order across different starting languages', () => {
      const languages = ['en', 'fr', 'zh', 'ja']

      languages.forEach((lang) => {
        const { unmount } = renderWithI18n(<LanguageSwitcher />, { language: lang })

        const options = screen.getAllByRole('option')
        expect(options[0]).toHaveValue('ja')
        expect(options[1]).toHaveValue('fr')
        expect(options[2]).toHaveValue('zh')
        expect(options[3]).toHaveValue('en')

        unmount()
      })
    })
  })
})
