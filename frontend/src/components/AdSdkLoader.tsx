import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    admaxads?: Array<{ admax_id: string; type: string }>
    __admaxjs?: unknown
  }
}

const AdSdkLoader: React.FC = () => {
  const loadedRef = useRef(false)

  useEffect(() => {
    // StrictMode対策: 既にロード済みの場合はスキップ
    if (loadedRef.current) {
      return
    }
    loadedRef.current = true

    // 既存のスクリプトを削除
    const existingScript = document.querySelector('script[src*="adm.shinobi.jp/st/t.js"]')
    if (existingScript) {
      existingScript.remove()
    }

    // グローバル変数をクリア
    delete window.__admaxjs

    // admaxadsキューを初期化
    if (!window.admaxads) {
      window.admaxads = []
    }

    // スクリプトを追加（DOM準備のため少し遅延）
    const timer = setTimeout(() => {
      const script = document.createElement('script')
      script.src = 'https://adm.shinobi.jp/st/t.js'
      script.async = true
      document.head.appendChild(script)
    }, 100)

    return () => {
      clearTimeout(timer)
    }
  }, [])

  return null
}

export default AdSdkLoader
