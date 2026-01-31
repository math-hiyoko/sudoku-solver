import type { GatsbySSR } from "gatsby"

export const onRenderBody: GatsbySSR["onRenderBody"] = ({ setHtmlAttributes }) => {
  // i18n config defaults to 'ja' for SSR, so this must match
  setHtmlAttributes({ lang: "ja" })
}
