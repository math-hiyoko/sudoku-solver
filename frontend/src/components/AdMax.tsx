import React, { useEffect, useRef } from 'react'

interface AdMaxProps {
  adId: string
  style?: React.CSSProperties
}

const AdMax: React.FC<AdMaxProps> = ({ adId, style }) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // 既存のスクリプトをクリア
    container.innerHTML = ''

    // 忍者AdMaxのスクリプトを動的に追加
    const script = document.createElement('script')
    script.src = `https://adm.shinobi.jp/s/${adId}`
    script.async = true
    container.appendChild(script)

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
