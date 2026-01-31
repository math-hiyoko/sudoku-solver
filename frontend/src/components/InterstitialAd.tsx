import React, { useEffect, useRef, useState } from 'react'

declare global {
  interface Window {
    admaxads?: Array<{ admax_id: string; type: string }>
  }
}

interface InterstitialAdProps {
  adId: string
  isOpen: boolean
  onClose: () => void
}

const InterstitialAd: React.FC<InterstitialAdProps> = ({ adId, isOpen, onClose }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [countdown, setCountdown] = useState(3)

  useEffect(() => {
    if (!isOpen) {
      setCountdown(3)
      return
    }

    // カウントダウンタイマー
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isOpen])

  useEffect(() => {
    const container = containerRef.current
    if (!isOpen || !container) return

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
  }, [adId, isOpen])

  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          maxWidth: '90%',
          maxHeight: '90%',
          overflow: 'auto',
          position: 'relative',
        }}
      >
        <button
          onClick={onClose}
          disabled={countdown > 0}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            padding: '8px 16px',
            fontSize: '14px',
            backgroundColor: countdown > 0 ? '#ccc' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: countdown > 0 ? 'not-allowed' : 'pointer',
            minWidth: '80px',
          }}
        >
          {countdown > 0 ? `${countdown}秒` : '閉じる'}
        </button>

        <div
          ref={containerRef}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '250px',
            marginTop: '40px',
          }}
        />
      </div>
    </div>
  )
}

export default InterstitialAd
