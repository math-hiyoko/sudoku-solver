import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

const LANGUAGES = [
  { code: 'ja', flag: '🇯🇵', label: '日本語' },
  { code: 'fr', flag: '🇫🇷', label: 'Français' },
  { code: 'zh', flag: '🇨🇳', label: '中文' },
  { code: 'en', flag: '🇬🇧', label: 'English' },
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
