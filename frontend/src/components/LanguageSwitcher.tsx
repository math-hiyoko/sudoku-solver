import React, { useCallback, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { detectLanguage } from '../i18n/config'

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
  const hasInitialized = useRef(false)

  // Apply user's preferred language after hydration (only once, only for SSR default)
  useEffect(() => {
    // Skip auto-detection in test environment
    if (process.env.NODE_ENV === 'test') {
      return
    }
    // Only run once and only if language is still the SSR default ('ja')
    if (hasInitialized.current || i18n.language !== 'ja') {
      return
    }
    hasInitialized.current = true

    const preferredLang = detectLanguage()
    if (preferredLang !== 'ja') {
      i18n.changeLanguage(preferredLang)
      document.documentElement.lang = preferredLang
    }
  }, [i18n])

  const changeLanguage = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = event.target.value
    i18n.changeLanguage(lang)
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang)
      document.documentElement.lang = lang
    }
  }, [i18n])

  const currentLanguage = i18n.language || 'ja'

  const currentLang = LANGUAGES.find(l => l.code === currentLanguage) || LANGUAGES[0]

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
          padding: '4px 6px',
          fontSize: '24px',
          fontWeight: '500',
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          color: '#333',
          border: '1px solid rgba(204, 204, 204, 0.5)',
          borderRadius: '6px',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
          outline: 'none',
          transition: 'all 0.2s ease',
          opacity: 0.7,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '1'
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.95)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '0.7'
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.7)'
        }}
        onFocus={(e) => {
          e.target.style.borderColor = '#007bff'
          e.target.style.opacity = '1'
        }}
        onBlur={(e) => {
          e.target.style.borderColor = 'rgba(204, 204, 204, 0.5)'
          e.target.style.opacity = '0.7'
        }}
      >
        {LANGUAGES.map((language) => (
          <option
            key={language.code}
            value={language.code}
          >
            {language.flag}
          </option>
        ))}
      </select>
    </div>
  )
}

export default LanguageSwitcher
