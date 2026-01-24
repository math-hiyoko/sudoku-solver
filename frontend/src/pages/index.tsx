import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import SudokuSolver from "../components/SudokuSolver"

const IndexPage: React.FC<PageProps> = () => {
  return <SudokuSolver />
}

export default IndexPage

export const Head: HeadFC = () => (
  <>
    <title>数独ソルバー</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
  </>
)
