import React, { useCallback, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { detectLanguage } from '../i18n/config'

const LANGUAGES = [
  { code: 'ja', flag: '🇯🇵', label: '日本語' },
  { code: 'fr', flag: '🇫🇷', label: 'Français' },
  { code: 'zh', flag: '🇨🇳', label: '中文' },
  { code: 'en', flag: '🇬🇧', label: 'English' },
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
    <div className="language-switcher">
      <select
        value={currentLanguage}
        onChange={changeLanguage}
        aria-label="Select language"
        title={currentLang.label}
        className="language-select"
      >
        {LANGUAGES.map((language) => (
          <option key={language.code} value={language.code}>
            {language.flag}
          </option>
        ))}
      </select>
    </div>
  )
}

export default LanguageSwitcher
