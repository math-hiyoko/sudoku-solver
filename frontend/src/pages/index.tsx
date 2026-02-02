import * as React from "react"
import { useRef, useEffect } from "react"
import type { HeadFC, PageProps } from "gatsby"
import { useTranslation } from "react-i18next"
import SudokuSolver from "../components/SudokuSolver"
import LanguageSwitcher from "../components/LanguageSwitcher"
import AdSlotDisplay from "../components/AdSlotDisplay"
import AdSdkLoader from "../components/AdSdkLoader"

const AD_ID = "326c6aae086754fcb0952b2dfa0c91f6"

const IndexPage: React.FC<PageProps> = () => {
  const adContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const adContainer = adContainerRef.current
    if (!adContainer) return

    const updateAdHeight = () => {
      const height = adContainer.offsetHeight
      document.documentElement.style.setProperty('--ad-banner-height', `${height}px`)
    }

    // 初期値を設定
    updateAdHeight()

    // ResizeObserverで広告の高さの変化を監視
    const resizeObserver = new ResizeObserver(updateAdHeight)
    resizeObserver.observe(adContainer)

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  return (
    <>
      <div
        ref={adContainerRef}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          padding: '10px 0',
          backgroundColor: '#f5f5f5',
        }}
      >
        <AdSlotDisplay admaxId={AD_ID} />
      </div>
      <AdSdkLoader />
      <LanguageSwitcher />
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
