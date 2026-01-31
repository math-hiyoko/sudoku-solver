import * as React from "react"
import { useEffect, useState, useRef } from "react"

const PC_AD_SCRIPT = "https://adm.shinobi.jp/s/8dc91f046104d62a27c2b4beb41ee218"
const MOBILE_AD_SCRIPT = "https://adm.shinobi.jp/s/d4571979e43b5d67633de9f2adaeffcb"

const AdBanner: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const adContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsClient(true)
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    if (!isClient || !adContainerRef.current) return

    // 既存のスクリプトをクリア
    adContainerRef.current.innerHTML = ""

    // 非同期でスクリプトを読み込み
    const script = document.createElement("script")
    script.src = isMobile ? MOBILE_AD_SCRIPT : PC_AD_SCRIPT
    script.async = true
    adContainerRef.current.appendChild(script)

    return () => {
      if (adContainerRef.current) {
        adContainerRef.current.innerHTML = ""
      }
    }
  }, [isClient, isMobile])

  if (!isClient) return null

  // スマホ：下部オーバーレイ（固定） 320x50
  if (isMobile) {
    return (
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "#fff",
          boxShadow: "0 -2px 10px rgba(0,0,0,0.1)",
          zIndex: 9999,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "4px 0",
        }}
      >
        <div
          ref={adContainerRef}
          style={{
            width: 320,
            height: 50,
            overflow: "hidden",
          }}
        />
      </div>
    )
  }

  // PC：画面下部（固定） 728x90
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#fff",
        borderTop: "1px solid #e0e0e0",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "8px 0",
      }}
    >
      <div
        ref={adContainerRef}
        style={{
          width: 728,
          height: 90,
          overflow: "hidden",
        }}
      />
    </div>
  )
}

export default AdBanner
