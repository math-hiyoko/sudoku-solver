import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

interface Language {
  code: string
  label: string
  ariaLabel: string
}

const LANGUAGES: Language[] = [
  { code: 'ja', label: '日本語', ariaLabel: 'Switch to Japanese' },
  { code: 'fr', label: 'FR', ariaLabel: 'Switch to French' },
  { code: 'zh', label: '中文', ariaLabel: 'Switch to Chinese' },
  { code: 'en', label: 'EN', ariaLabel: 'Switch to English' },
]

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation()

  const changeLanguage = useCallback((lang: string) => {
    i18n.changeLanguage(lang)
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang)
      document.documentElement.lang = lang
    }
  }, [i18n])

  const currentLanguage = i18n.language || 'en'

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      display: 'flex',
      gap: '5px',
      zIndex: 1000,
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '5px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    }}>
      {LANGUAGES.map((language) => (
        <button
          key={language.code}
          onClick={() => changeLanguage(language.code)}
          style={{
            padding: '8px 12px',
            fontSize: '14px',
            fontWeight: currentLanguage === language.code ? '700' : '400',
            backgroundColor: currentLanguage === language.code ? '#007bff' : '#f0f0f0',
            color: currentLanguage === language.code ? 'white' : '#333',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            minWidth: '50px',
          }}
          aria-label={language.ariaLabel}
        >
          {language.label}
        </button>
      ))}
    </div>
  )
}

export default LanguageSwitcher
