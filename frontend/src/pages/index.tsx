import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import SudokuSolver from "../components/SudokuSolver"

const IndexPage: React.FC<PageProps> = () => {
  return <SudokuSolver />
}

export default IndexPage

export const Head: HeadFC = () => <title>数独ソルバー</title>
