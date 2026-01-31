import type { GatsbySSR } from "gatsby"
import "./src/i18n/config"

export const onRenderBody: GatsbySSR["onRenderBody"] = ({ setHtmlAttributes }) => {
  // i18n config defaults to 'ja' for SSR, so this must match
  setHtmlAttributes({ lang: "ja" })
}
