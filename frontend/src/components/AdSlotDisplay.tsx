import React, { useEffect, useRef, forwardRef } from 'react'

interface AdSlotDisplayProps {
  admaxId: string
  maxWidth: number
  height: number
}

declare global {
  interface Window {
    admaxads?: Array<{ admax_id: string; type: string }>
  }
}

const AdSlotDisplay = forwardRef<HTMLDivElement, AdSlotDisplayProps>(
  ({ admaxId, maxWidth, height }, ref) => {
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
      window.admaxads.push({ admax_id: admaxId, type: 'banner' })
    }, [admaxId])

    return (
      <div
        ref={ref}
        className="admax-ads"
        data-admax-id={admaxId}
        style={{
          display: 'inline-block',
          width: '100%',
          maxWidth: `${maxWidth}px`,
          height: `${height}px`,
        }}
      />
    )
  }
)

AdSlotDisplay.displayName = 'AdSlotDisplay'

export default AdSlotDisplay
