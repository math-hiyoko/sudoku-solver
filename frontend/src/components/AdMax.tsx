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

    // admaxads配列に広告IDをプッシュするスクリプトを追加
    const configScript = document.createElement('script')
    configScript.textContent = `(admaxads = window.admaxads || []).push({admax_id: "${adId}", type: "banner"});`
    container.appendChild(configScript)

    // 忍者AdMaxの非同期スクリプトを追加（毎回新しく追加して広告を初期化）
    const adScript = document.createElement('script')
    adScript.src = 'https://adm.shinobi.jp/st/t.js'
    adScript.async = true
    container.appendChild(adScript)

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
