import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

interface Language {
  code: string
  flag: string
  label: string
  ariaLabel: string
}

const LANGUAGES: Language[] = [
  { code: 'ja', flag: '🇯🇵', label: '日本語', ariaLabel: 'Switch to Japanese' },
  { code: 'fr', flag: '🇫🇷', label: 'Français', ariaLabel: 'Switch to French' },
  { code: 'zh', flag: '🇨🇳', label: '中文', ariaLabel: 'Switch to Chinese' },
  { code: 'en', flag: '🇬🇧', label: 'English', ariaLabel: 'Switch to English' },
]

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation()

  const changeLanguage = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = event.target.value
    i18n.changeLanguage(lang)
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang)
      document.documentElement.lang = lang
    }
  }, [i18n])

  const currentLanguage = i18n.language || 'en'

  const currentLang = LANGUAGES.find(l => l.code === currentLanguage) || LANGUAGES[3]

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      zIndex: 1000,
    }}>
      <select
        value={currentLanguage}
        onChange={changeLanguage}
        aria-label="Select language"
        title={currentLang.label}
        style={{
          padding: '6px 8px',
          fontSize: '20px',
          fontWeight: '500',
          backgroundColor: 'white',
          color: '#333',
          border: '1px solid #ccc',
          borderRadius: '6px',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          outline: 'none',
          transition: 'all 0.2s ease',
          minWidth: '50px',
        }}
        onFocus={(e) => {
          e.target.style.borderColor = '#007bff'
          e.target.style.boxShadow = '0 2px 8px rgba(0, 123, 255, 0.2)'
        }}
        onBlur={(e) => {
          e.target.style.borderColor = '#ccc'
          e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)'
        }}
      >
        {LANGUAGES.map((language) => (
          <option
            key={language.code}
            value={language.code}
          >
            {language.flag} {language.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default LanguageSwitcher
