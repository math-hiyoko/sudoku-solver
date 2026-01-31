import React from 'react'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { renderWithI18n } from '../utils/i18n-test-utils'
import LanguageSwitcher from '../../components/LanguageSwitcher'
import NumberPad from '../../components/NumberPad'

describe('Language Switching Integration', () => {
  const mockOnNumberSelect = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('switches language across multiple components', async () => {
    const { i18n } = renderWithI18n(
      <>
        <LanguageSwitcher />
        <NumberPad
          onNumberSelect={mockOnNumberSelect}
          selectedCell={{ row: 0, col: 0 }}
        />
      </>,
      { language: 'en' }
    )

    // Initially in English (row and col are 0-indexed, but displayed as 1-indexed)
    expect(screen.getByText('Selected: Row 1 Col 1')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Input number 1' })).toBeInTheDocument()

    // Switch to Japanese
    fireEvent.change(screen.getByRole('combobox', { name: 'Select language' }), { target: { value: 'ja' } })

    await waitFor(() => {
      expect(i18n.language).toBe('ja')
    })

    // Verify Japanese text appears
    expect(screen.getByText('選択中: 1行 1列')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '数字1を入力' })).toBeInTheDocument()

    // Switch to French
    fireEvent.change(screen.getByRole('combobox', { name: 'Select language' }), { target: { value: 'fr' } })

    await waitFor(() => {
      expect(i18n.language).toBe('fr')
    })

    // Verify French text appears
    expect(screen.getByText('Sélectionné : Ligne 1 Col 1')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Entrer le numéro 1' })).toBeInTheDocument()

    // Switch to Chinese
    fireEvent.change(screen.getByRole('combobox', { name: 'Select language' }), { target: { value: 'zh' } })

    await waitFor(() => {
      expect(i18n.language).toBe('zh')
    })

    // Verify Chinese text appears
    expect(screen.getByText('已选择：第1行 第1列')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '输入数字1' })).toBeInTheDocument()
  })

  it('persists language selection to localStorage', () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem')
    renderWithI18n(<LanguageSwitcher />, { language: 'en' })

    // Switch to French
    fireEvent.change(screen.getByRole('combobox', { name: 'Select language' }), { target: { value: 'fr' } })
    expect(setItemSpy).toHaveBeenCalledWith('language', 'fr')

    // Switch to Chinese
    fireEvent.change(screen.getByRole('combobox', { name: 'Select language' }), { target: { value: 'zh' } })
    expect(setItemSpy).toHaveBeenCalledWith('language', 'zh')

    // Switch to Japanese
    fireEvent.change(screen.getByRole('combobox', { name: 'Select language' }), { target: { value: 'ja' } })
    expect(setItemSpy).toHaveBeenCalledWith('language', 'ja')

    // Switch back to English
    fireEvent.change(screen.getByRole('combobox', { name: 'Select language' }), { target: { value: 'en' } })
    expect(setItemSpy).toHaveBeenCalledWith('language', 'en')

    setItemSpy.mockRestore()
  })

  it('updates HTML lang attribute when language changes', async () => {
    renderWithI18n(<LanguageSwitcher />, { language: 'en' })

    expect(document.documentElement.lang).toBe('en')

    fireEvent.change(screen.getByRole('combobox', { name: 'Select language' }), { target: { value: 'ja' } })
    await waitFor(() => {
      expect(document.documentElement.lang).toBe('ja')
    })

    fireEvent.change(screen.getByRole('combobox', { name: 'Select language' }), { target: { value: 'fr' } })
    await waitFor(() => {
      expect(document.documentElement.lang).toBe('fr')
    })

    fireEvent.change(screen.getByRole('combobox', { name: 'Select language' }), { target: { value: 'zh' } })
    await waitFor(() => {
      expect(document.documentElement.lang).toBe('zh')
    })
  })

  it('maintains selected language in dropdown during language switches', async () => {
    renderWithI18n(<LanguageSwitcher />, { language: 'en' })

    const select = screen.getByRole('combobox', { name: 'Select language' }) as HTMLSelectElement

    // English should be selected initially
    expect(select.value).toBe('en')

    // Switch to Japanese
    fireEvent.change(select, { target: { value: 'ja' } })

    await waitFor(() => {
      expect(select.value).toBe('ja')
    })
  })

  it('renders components correctly in all 4 languages from start', () => {
    const languages = ['en', 'fr', 'zh', 'ja']
    const expectedTexts: Record<string, string> = {
      en: 'Tap a cell to select',
      fr: 'Appuyez sur une cellule pour sélectionner',
      zh: '点击单元格进行选择',
      ja: 'セルをタップして選択してください',
    }

    languages.forEach((lang) => {
      const { unmount } = renderWithI18n(
        <NumberPad onNumberSelect={mockOnNumberSelect} selectedCell={null} />,
        { language: lang }
      )

      expect(screen.getByText(expectedTexts[lang])).toBeInTheDocument()
      unmount()
    })
  })

  it('displays language options in correct order: Japanese, French, Chinese, English', () => {
    renderWithI18n(<LanguageSwitcher />, { language: 'ja' })

    const allOptions = screen.getAllByRole('option')

    // Verify we have exactly 4 options
    expect(allOptions).toHaveLength(4)

    // Verify order by checking values
    expect(allOptions[0]).toHaveValue('ja')
    expect(allOptions[1]).toHaveValue('fr')
    expect(allOptions[2]).toHaveValue('zh')
    expect(allOptions[3]).toHaveValue('en')

    // Verify order by checking option text content
    expect(allOptions[0]).toHaveTextContent('日本語')
    expect(allOptions[1]).toHaveTextContent('Français')
    expect(allOptions[2]).toHaveTextContent('中文')
    expect(allOptions[3]).toHaveTextContent('English')
  })

  describe('Default language behavior', () => {
    it('defaults to English when no language is specified', () => {
      const { i18n } = renderWithI18n(<LanguageSwitcher />)

      expect(i18n.language).toBe('en')
    })

    it('uses English for initial render without localStorage', () => {
      // Note: localStorage is already mocked in jest.setup.js
      const { i18n } = renderWithI18n(
        <>
          <LanguageSwitcher />
          <NumberPad onNumberSelect={mockOnNumberSelect} selectedCell={null} />
        </>
      )

      expect(i18n.language).toBe('en')
      expect(screen.getByText('Tap a cell to select')).toBeInTheDocument()
    })
  })

  describe('localStorage persistence', () => {
    it('calls localStorage.setItem for each language change', () => {
      const setItemSpy = jest.spyOn(Storage.prototype, 'setItem')
      renderWithI18n(<LanguageSwitcher />, { language: 'en' })

      const languages = [
        { code: 'ja' },
        { code: 'fr' },
        { code: 'zh' },
        { code: 'en' },
      ]

      languages.forEach(({ code }) => {
        fireEvent.change(screen.getByRole('combobox', { name: 'Select language' }), { target: { value: code } })
        expect(setItemSpy).toHaveBeenCalledWith('language', code)
      })

      setItemSpy.mockRestore()
    })

    it('saves language immediately upon change', () => {
      const setItemSpy = jest.spyOn(Storage.prototype, 'setItem')
      renderWithI18n(<LanguageSwitcher />, { language: 'en' })

      fireEvent.change(screen.getByRole('combobox', { name: 'Select language' }), { target: { value: 'fr' } })

      // Should be called immediately, not after a delay
      expect(setItemSpy).toHaveBeenCalledWith('language', 'fr')
      expect(setItemSpy).toHaveBeenCalledTimes(1)

      setItemSpy.mockRestore()
    })

    it('updates both i18n language and localStorage together', () => {
      const setItemSpy = jest.spyOn(Storage.prototype, 'setItem')
      const { i18n } = renderWithI18n(<LanguageSwitcher />, { language: 'en' })

      fireEvent.change(screen.getByRole('combobox', { name: 'Select language' }), { target: { value: 'zh' } })

      expect(i18n.language).toBe('zh')
      expect(setItemSpy).toHaveBeenCalledWith('language', 'zh')

      setItemSpy.mockRestore()
    })
  })

  describe('Cross-component synchronization', () => {
    it('synchronizes language across LanguageSwitcher and NumberPad', async () => {
      renderWithI18n(
        <>
          <LanguageSwitcher />
          <NumberPad onNumberSelect={mockOnNumberSelect} selectedCell={null} />
        </>,
        { language: 'en' }
      )

      // Initial state: English
      expect(screen.getByText('Tap a cell to select')).toBeInTheDocument()

      // Change to Japanese
      fireEvent.change(screen.getByRole('combobox', { name: 'Select language' }), { target: { value: 'ja' } })

      await waitFor(() => {
        expect(screen.getByText('セルをタップして選択してください')).toBeInTheDocument()
      })
    })

    it('maintains language consistency after multiple switches', async () => {
      const { i18n } = renderWithI18n(
        <>
          <LanguageSwitcher />
          <NumberPad onNumberSelect={mockOnNumberSelect} selectedCell={{ row: 0, col: 0 }} />
        </>,
        { language: 'en' }
      )

      // English -> French
      fireEvent.change(screen.getByRole('combobox', { name: 'Select language' }), { target: { value: 'fr' } })
      await waitFor(() => {
        expect(i18n.language).toBe('fr')
        expect(screen.getByText('Sélectionné : Ligne 1 Col 1')).toBeInTheDocument()
      })

      // French -> Chinese
      fireEvent.change(screen.getByRole('combobox', { name: 'Select language' }), { target: { value: 'zh' } })
      await waitFor(() => {
        expect(i18n.language).toBe('zh')
        expect(screen.getByText('已选择：第1行 第1列')).toBeInTheDocument()
      })

      // Chinese -> Japanese
      fireEvent.change(screen.getByRole('combobox', { name: 'Select language' }), { target: { value: 'ja' } })
      await waitFor(() => {
        expect(i18n.language).toBe('ja')
        expect(screen.getByText('選択中: 1行 1列')).toBeInTheDocument()
      })
    })
  })
})
