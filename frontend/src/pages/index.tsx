import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import { useTranslation } from "react-i18next"
import SudokuSolver from "../components/SudokuSolver"
import LanguageSwitcher from "../components/LanguageSwitcher"

const IndexPage: React.FC<PageProps> = () => {
  return (
    <>
      <LanguageSwitcher />
      <SudokuSolver />
    </>
  )
}

export default IndexPage

export const Head: HeadFC = () => {
  const { t, i18n } = useTranslation()
  const currentLang = i18n.language || 'en'

  const getLanguageName = (lang: string): string => {
    const languageNames: Record<string, string> = {
      en: 'English',
      fr: 'French',
      zh: 'Chinese',
      ja: 'Japanese',
    }
    return languageNames[lang] || 'English'
  }

  return (
    <>
      <title>{t('app.siteTitle')}</title>
      <meta name="description" content={t('app.description')} />
      <meta name="keywords" content={t('app.keywords')} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <html lang={currentLang} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={t('app.siteTitle')} />
      <meta property="og:description" content={t('app.description')} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={t('app.siteTitle')} />
      <meta name="twitter:description" content={t('app.description')} />

      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content={getLanguageName(currentLang)} />
      <meta name="author" content={t('app.title')} />
    </>
  )
}
