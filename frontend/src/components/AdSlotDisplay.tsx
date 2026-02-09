import React, { useEffect, useRef } from 'react'

const SWITCH_AD_ID = '326c6aae086754fcb0952b2dfa0c91f6'
const ACTION_AD_ID = '4f3e88c41850ab88c16d7a485c3ed7fd'

declare global {
  interface Window {
    admaxads?: Array<{ admax_id: string; type: string }>
  }
}

const AdSlotDisplay: React.FC = () => {
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
    window.admaxads.push({ admax_id: SWITCH_AD_ID, type: 'switch' })
    window.admaxads.push({ admax_id: ACTION_AD_ID, type: 'action' })
  }, [])

  return (
    <div
      className="admax-switch"
      data-admax-id={SWITCH_AD_ID}
      style={{ display: 'inline-block' }}
    />
  )
}

export default AdSlotDisplay
