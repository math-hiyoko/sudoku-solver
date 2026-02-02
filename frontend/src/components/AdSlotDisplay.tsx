import React, { useEffect, useRef } from 'react'

interface AdSlotDisplayProps {
  admaxId: string
}

declare global {
  interface Window {
    admaxads?: Array<{ admax_id: string; type: string }>
  }
}

const AdSlotDisplay: React.FC<AdSlotDisplayProps> = ({ admaxId }) => {
  const pushedRef = useRef(false)

  useEffect(() => {
    // StrictMode対策: 既にプッシュ済みの場合はスキップ
    if (pushedRef.current) {
      return
    }
    pushedRef.current = true

    // admaxadsキューに広告情報をプッシュ
    if (!window.admaxads) {
      window.admaxads = []
    }
    window.admaxads.push({ admax_id: admaxId, type: 'switch' })
  }, [admaxId])

  return (
    <div
      className="admax-switch"
      data-admax-id={admaxId}
      style={{ display: 'inline-block' }}
    />
  )
}

export default AdSlotDisplay
