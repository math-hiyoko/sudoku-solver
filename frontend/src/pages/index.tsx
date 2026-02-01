import * as React from "react"
import { useRef, useEffect, useState } from "react"
import type { HeadFC, PageProps } from "gatsby"
import { useTranslation } from "react-i18next"
import SudokuSolver from "../components/SudokuSolver"
import LanguageSwitcher from "../components/LanguageSwitcher"
import AdSlotDisplay from "../components/AdSlotDisplay"
import AdSdkLoader from "../components/AdSdkLoader"

const AD_CONFIG = {
  pc: { id: "170ab79f44a8ae267d269b78243cdeda", maxWidth: 728, height: 90 },
  mobile: { id: "9cfd6e04195769cd41c84a6797a06368", maxWidth: 320, height: 50 },
}

const MOBILE_BREAKPOINT = 768

const IndexPage: React.FC<PageProps> = () => {
  const adContainerRef = useRef<HTMLDivElement>(null)
  const adSlotRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [adLoaded, setAdLoaded] = useState(false)

  useEffect(() => {
    // 初回ロード時のみデバイス検出（広告は動的に切り替えない）
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
  }, [])

  useEffect(() => {
    const adSlot = adSlotRef.current
    if (!adSlot) return

    // 広告スロットに子要素が追加されたかを監視
    const checkAdLoaded = () => {
      const hasAdContent = adSlot.children.length > 0
      setAdLoaded(hasAdContent)
    }

    // MutationObserverで広告コンテンツの挿入を監視
    const mutationObserver = new MutationObserver(checkAdLoaded)
    mutationObserver.observe(adSlot, { childList: true, subtree: true })

    // 初期チェック
    checkAdLoaded()

    return () => {
      mutationObserver.disconnect()
    }
  }, [])

  useEffect(() => {
    const adContainer = adContainerRef.current
    if (!adContainer) return

    const updateAdHeight = () => {
      // 広告が読み込まれていない場合は0
      const height = adLoaded ? adContainer.offsetHeight : 0
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
  }, [adLoaded])

  const adConfig = isMobile ? AD_CONFIG.mobile : AD_CONFIG.pc

  return (
    <>
      <div
        ref={adContainerRef}
        style={{
          width: '100%',
          display: adLoaded ? 'flex' : 'none',
          justifyContent: 'center',
          padding: '10px 0',
          backgroundColor: '#f5f5f5',
        }}
      >
        <AdSlotDisplay
          ref={adSlotRef}
          admaxId={adConfig.id}
          maxWidth={adConfig.maxWidth}
          height={adConfig.height}
        />
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
