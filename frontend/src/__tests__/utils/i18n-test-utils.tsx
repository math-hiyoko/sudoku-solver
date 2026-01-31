import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// Import translation files
import enTranslation from '../../locales/en/translation.json'
import frTranslation from '../../locales/fr/translation.json'
import zhTranslation from '../../locales/zh/translation.json'
import jaTranslation from '../../locales/ja/translation.json'

const resources = {
  en: { translation: enTranslation },
  fr: { translation: frTranslation },
  zh: { translation: zhTranslation },
  ja: { translation: jaTranslation },
}

// Create a test i18n instance
export const createTestI18n = (language = 'ja') => {
  const testI18n = i18n.createInstance()

  testI18n
    .use(initReactI18next)
    .init({
      lng: language,
      fallbackLng: 'ja',
      resources,
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
    })

  return testI18n
}

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  language?: string
}

// Custom render function with i18n provider
export const renderWithI18n = (
  ui: ReactElement,
  { language = 'ja', ...renderOptions }: CustomRenderOptions = {}
) => {
  const testI18n = createTestI18n(language)

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <I18nextProvider i18n={testI18n}>{children}</I18nextProvider>
  )

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    i18n: testI18n,
  }
}

// Export re-exports for convenience
export * from '@testing-library/react'
export { renderWithI18n as render }
