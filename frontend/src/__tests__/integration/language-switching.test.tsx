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

    // Initially in English
    expect(screen.getByText('Tap a cell to select')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Input number 1' })).toBeInTheDocument()

    // Switch to Japanese
    fireEvent.click(screen.getByRole('button', { name: 'Switch to Japanese' }))

    await waitFor(() => {
      expect(i18n.language).toBe('ja')
    })

    // Verify Japanese text appears
    expect(screen.getByText('選択中: 1行 1列')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '数字1を入力' })).toBeInTheDocument()

    // Switch to French
    fireEvent.click(screen.getByRole('button', { name: 'Switch to French' }))

    await waitFor(() => {
      expect(i18n.language).toBe('fr')
    })

    // Verify French text appears
    expect(screen.getByText('Sélectionné : Ligne 1 Col 1')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Entrer le numéro 1' })).toBeInTheDocument()

    // Switch to Chinese
    fireEvent.click(screen.getByRole('button', { name: 'Switch to Chinese' }))

    await waitFor(() => {
      expect(i18n.language).toBe('zh')
    })

    // Verify Chinese text appears
    expect(screen.getByText('已选择：第1行 第1列')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '输入数字1' })).toBeInTheDocument()
  })

  it('persists language selection to localStorage', () => {
    renderWithI18n(<LanguageSwitcher />, { language: 'en' })

    // Switch to French
    fireEvent.click(screen.getByRole('button', { name: 'Switch to French' }))
    expect(localStorage.setItem).toHaveBeenCalledWith('language', 'fr')

    // Switch to Chinese
    fireEvent.click(screen.getByRole('button', { name: 'Switch to Chinese' }))
    expect(localStorage.setItem).toHaveBeenCalledWith('language', 'zh')

    // Switch to Japanese
    fireEvent.click(screen.getByRole('button', { name: 'Switch to Japanese' }))
    expect(localStorage.setItem).toHaveBeenCalledWith('language', 'ja')

    // Switch back to English
    fireEvent.click(screen.getByRole('button', { name: 'Switch to English' }))
    expect(localStorage.setItem).toHaveBeenCalledWith('language', 'en')
  })

  it('updates HTML lang attribute when language changes', async () => {
    renderWithI18n(<LanguageSwitcher />, { language: 'en' })

    expect(document.documentElement.lang).toBe('en')

    fireEvent.click(screen.getByRole('button', { name: 'Switch to Japanese' }))
    await waitFor(() => {
      expect(document.documentElement.lang).toBe('ja')
    })

    fireEvent.click(screen.getByRole('button', { name: 'Switch to French' }))
    await waitFor(() => {
      expect(document.documentElement.lang).toBe('fr')
    })

    fireEvent.click(screen.getByRole('button', { name: 'Switch to Chinese' }))
    await waitFor(() => {
      expect(document.documentElement.lang).toBe('zh')
    })
  })

  it('maintains active button styling during language switches', async () => {
    renderWithI18n(<LanguageSwitcher />, { language: 'en' })

    const enButton = screen.getByRole('button', { name: 'Switch to English' })
    const jaButton = screen.getByRole('button', { name: 'Switch to Japanese' })

    // English button should be active
    expect(enButton).toHaveStyle({ backgroundColor: '#007bff', fontWeight: '700' })
    expect(jaButton).toHaveStyle({ backgroundColor: '#f0f0f0', fontWeight: '400' })

    // Switch to Japanese
    fireEvent.click(jaButton)

    await waitFor(() => {
      expect(jaButton).toHaveStyle({ backgroundColor: '#007bff', fontWeight: '700' })
      expect(enButton).toHaveStyle({ backgroundColor: '#f0f0f0', fontWeight: '400' })
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

  it('displays language buttons in correct order: Japanese, French, Chinese, English', () => {
    renderWithI18n(<LanguageSwitcher />, { language: 'ja' })

    const allButtons = screen.getAllByRole('button')

    // Verify we have exactly 4 buttons
    expect(allButtons).toHaveLength(4)

    // Verify order by checking aria-labels
    expect(allButtons[0]).toHaveAttribute('aria-label', 'Switch to Japanese')
    expect(allButtons[1]).toHaveAttribute('aria-label', 'Switch to French')
    expect(allButtons[2]).toHaveAttribute('aria-label', 'Switch to Chinese')
    expect(allButtons[3]).toHaveAttribute('aria-label', 'Switch to English')

    // Verify order by checking button text content
    expect(allButtons[0]).toHaveTextContent('日本語')
    expect(allButtons[1]).toHaveTextContent('FR')
    expect(allButtons[2]).toHaveTextContent('中文')
    expect(allButtons[3]).toHaveTextContent('EN')
  })

  describe('Default language behavior', () => {
    it('defaults to English when no language is specified', () => {
      const { i18n } = renderWithI18n(<LanguageSwitcher />)

      expect(i18n.language).toBe('en')
    })

    it('uses English for initial render without localStorage', () => {
      (localStorage.getItem as jest.Mock).mockReturnValue(null)

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
      renderWithI18n(<LanguageSwitcher />, { language: 'en' })

      const languages = [
        { button: 'Switch to Japanese', code: 'ja' },
        { button: 'Switch to French', code: 'fr' },
        { button: 'Switch to Chinese', code: 'zh' },
        { button: 'Switch to English', code: 'en' },
      ]

      languages.forEach(({ button, code }) => {
        fireEvent.click(screen.getByRole('button', { name: button }))
        expect(localStorage.setItem).toHaveBeenCalledWith('language', code)
      })
    })

    it('saves language immediately upon change', () => {
      renderWithI18n(<LanguageSwitcher />, { language: 'en' })

      fireEvent.click(screen.getByRole('button', { name: 'Switch to French' }))

      // Should be called immediately, not after a delay
      expect(localStorage.setItem).toHaveBeenCalledWith('language', 'fr')
      expect(localStorage.setItem).toHaveBeenCalledTimes(1)
    })

    it('updates both i18n language and localStorage together', () => {
      const { i18n } = renderWithI18n(<LanguageSwitcher />, { language: 'en' })

      fireEvent.click(screen.getByRole('button', { name: 'Switch to Chinese' }))

      expect(i18n.language).toBe('zh')
      expect(localStorage.setItem).toHaveBeenCalledWith('language', 'zh')
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
      fireEvent.click(screen.getByRole('button', { name: 'Switch to Japanese' }))

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
      fireEvent.click(screen.getByRole('button', { name: 'Switch to French' }))
      await waitFor(() => {
        expect(i18n.language).toBe('fr')
        expect(screen.getByText('Sélectionné : Ligne 1 Col 1')).toBeInTheDocument()
      })

      // French -> Chinese
      fireEvent.click(screen.getByRole('button', { name: 'Switch to Chinese' }))
      await waitFor(() => {
        expect(i18n.language).toBe('zh')
        expect(screen.getByText('已选择：第1行 第1列')).toBeInTheDocument()
      })

      // Chinese -> Japanese
      fireEvent.click(screen.getByRole('button', { name: 'Switch to Japanese' }))
      await waitFor(() => {
        expect(i18n.language).toBe('ja')
        expect(screen.getByText('選択中: 1行 1列')).toBeInTheDocument()
      })
    })
  })
})
