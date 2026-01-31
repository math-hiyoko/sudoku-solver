import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import jaTranslation from '../../locales/ja/translation.json'
import enTranslation from '../../locales/en/translation.json'
import frTranslation from '../../locales/fr/translation.json'
import zhTranslation from '../../locales/zh/translation.json'

describe('i18n configuration', () => {
  beforeEach(() => {
    // Reset localStorage mock
    jest.clearAllMocks()
  })

  it('loads all translation resources', () => {
    const testI18n = i18n.createInstance()

    testI18n.use(initReactI18next).init({
      resources: {
        ja: { translation: jaTranslation },
        en: { translation: enTranslation },
        fr: { translation: frTranslation },
        zh: { translation: zhTranslation },
      },
      lng: 'en',
      fallbackLng: 'en',
    })

    expect(testI18n.hasResourceBundle('en', 'translation')).toBe(true)
    expect(testI18n.hasResourceBundle('ja', 'translation')).toBe(true)
    expect(testI18n.hasResourceBundle('fr', 'translation')).toBe(true)
    expect(testI18n.hasResourceBundle('zh', 'translation')).toBe(true)
  })

  it('has correct fallback language', async () => {
    const testI18n = i18n.createInstance()

    await testI18n.use(initReactI18next).init({
      resources: {
        en: { translation: enTranslation },
      },
      lng: 'invalid-language',
      fallbackLng: 'en',
    })

    // After initialization with invalid language, it should fall back to 'en'
    // Note: i18next may set language to the invalid value initially, but will use fallback for translations
    expect(testI18n.t('app.title')).toBe('Sudoku Solver')
  })

  describe('translation completeness', () => {
    const requiredKeys = [
      'app.title',
      'app.siteTitle',
      'app.description',
      'board.inputPrompt',
      'solver.solve',
      'solver.clear',
      'errors.inputError.label',
      'errors.inputError.hint',
    ]

    const languages = ['en', 'ja', 'fr', 'zh']

    languages.forEach((lang) => {
      it(`has all required keys in ${lang} translation`, () => {
        const testI18n = i18n.createInstance()

        const translations = {
          en: enTranslation,
          ja: jaTranslation,
          fr: frTranslation,
          zh: zhTranslation,
        }

        testI18n.use(initReactI18next).init({
          resources: {
            [lang]: { translation: translations[lang as keyof typeof translations] },
          },
          lng: lang,
          fallbackLng: false,
        })

        requiredKeys.forEach((key) => {
          const value = testI18n.t(key)
          expect(value).toBeTruthy()
          expect(value).not.toBe(key) // Should not return the key itself
        })
      })
    })
  })

  describe('translation values', () => {
    it('English translations are correct', () => {
      const testI18n = i18n.createInstance()

      testI18n.use(initReactI18next).init({
        resources: { en: { translation: enTranslation } },
        lng: 'en',
      })

      expect(testI18n.t('app.title')).toBe('Sudoku Solver')
      expect(testI18n.t('solver.solve')).toBe('Solve')
      expect(testI18n.t('solver.clear')).toBe('Clear')
    })

    it('Japanese translations are correct', () => {
      const testI18n = i18n.createInstance()

      testI18n.use(initReactI18next).init({
        resources: { ja: { translation: jaTranslation } },
        lng: 'ja',
      })

      expect(testI18n.t('app.title')).toBe('数独ソルバー')
      expect(testI18n.t('solver.solve')).toBe('解く')
      expect(testI18n.t('solver.clear')).toBe('クリア')
    })

    it('French translations are correct', () => {
      const testI18n = i18n.createInstance()

      testI18n.use(initReactI18next).init({
        resources: { fr: { translation: frTranslation } },
        lng: 'fr',
      })

      expect(testI18n.t('app.title')).toBe('Solveur de Sudoku')
      expect(testI18n.t('solver.solve')).toBe('Résoudre')
      expect(testI18n.t('solver.clear')).toBe('Effacer')
    })

    it('Chinese translations are correct', () => {
      const testI18n = i18n.createInstance()

      testI18n.use(initReactI18next).init({
        resources: { zh: { translation: zhTranslation } },
        lng: 'zh',
      })

      expect(testI18n.t('app.title')).toBe('数独求解器')
      expect(testI18n.t('solver.solve')).toBe('求解')
      expect(testI18n.t('solver.clear')).toBe('清除')
    })
  })

  describe('interpolation', () => {
    it('handles interpolation correctly', () => {
      const testI18n = i18n.createInstance()

      testI18n.use(initReactI18next).init({
        resources: { en: { translation: enTranslation } },
        lng: 'en',
        interpolation: { escapeValue: false },
      })

      const result = testI18n.t('solver.solutionCounter', { index: 5, total: 10 })
      expect(result).toBe('Solution 5 / 10')
    })

    it('handles interpolation in all languages', () => {
      const testI18n = i18n.createInstance()

      testI18n.use(initReactI18next).init({
        resources: {
          en: { translation: enTranslation },
          ja: { translation: jaTranslation },
          fr: { translation: frTranslation },
          zh: { translation: zhTranslation },
        },
        lng: 'ja',
        interpolation: { escapeValue: false },
      })

      // Japanese
      expect(testI18n.t('solver.solutionCounter', { index: 2, total: 5 })).toBe('解 2 / 5')

      // Switch to French
      testI18n.changeLanguage('fr')
      expect(testI18n.t('solver.solutionCounter', { index: 2, total: 5 })).toBe('Solution 2 / 5')

      // Switch to Chinese
      testI18n.changeLanguage('zh')
      expect(testI18n.t('solver.solutionCounter', { index: 2, total: 5 })).toBe('解决方案 2 / 5')
    })
  })
})
