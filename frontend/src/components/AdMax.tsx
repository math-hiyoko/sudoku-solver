import React, { useEffect, useRef } from 'react'

declare global {
  interface Window {
    admaxads?: Array<{ admax_id: string; type: string }>
  }
}

interface AdMaxProps {
  adId: string
  style?: React.CSSProperties
}

const AdMax: React.FC<AdMaxProps> = ({ adId, style }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const scriptLoadedRef = useRef<boolean>(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // 既存の広告要素をクリア
    container.innerHTML = ''

    // ins要素を作成
    const ins = document.createElement('ins')
    ins.className = 'admax-ads'
    ins.style.display = 'block'
    ins.setAttribute('data-admax-id', adId)
    container.appendChild(ins)

    // admaxads配列に広告IDをプッシュ
    window.admaxads = window.admaxads || []
    window.admaxads.push({ admax_id: adId, type: 'banner' })

    // 非同期スクリプトがまだ読み込まれていなければ追加
    if (!scriptLoadedRef.current && !document.querySelector('script[src="https://adm.shinobi.jp/st/t.js"]')) {
      const script = document.createElement('script')
      script.src = 'https://adm.shinobi.jp/st/t.js'
      script.async = true
      document.body.appendChild(script)
      scriptLoadedRef.current = true
    }

    return () => {
      container.innerHTML = ''
    }
  }, [adId])

  return (
    <div
      ref={containerRef}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        ...style,
      }}
    />
  )
}

export default AdMax
