import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import { useTranslation } from "react-i18next"
import SudokuSolver from "../components/SudokuSolver"
import LanguageSwitcher from "../components/LanguageSwitcher"
import AdSlotDisplay from "../components/AdSlotDisplay"
import AdSdkLoader from "../components/AdSdkLoader"

const AD_ID = "170ab79f44a8ae267d269b78243cdeda"

const IndexPage: React.FC<PageProps> = () => {
  return (
    <>
      <LanguageSwitcher />
      <div style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        padding: '10px 0',
        backgroundColor: '#f5f5f5',
      }}>
        <AdSlotDisplay admaxId={AD_ID} />
      </div>
      <AdSdkLoader />
      <SudokuSolver />
    </>
  )
}

export default IndexPage

export const Head: HeadFC = () => {
  const { t, i18n } = useTranslation()
  const currentLang = i18n.language || 'ja'

  const getLanguageName = (lang: string): string => {
    const languageNames: Record<string, string> = {
      ja: 'Japanese',
      en: 'English',
      fr: 'French',
      zh: 'Chinese',
    }
    return languageNames[lang] || 'Japanese'
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

      {/* Google Search Console */}
      <meta name="google-site-verification" content="UctFPhueN-xFWQsqr49PfXY0LXO_orciS77jzWl3PZ0" />
    </>
  )
}
