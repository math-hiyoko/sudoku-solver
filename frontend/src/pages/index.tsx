import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import SudokuSolver from "../components/SudokuSolver"

const IndexPage: React.FC<PageProps> = () => {
  return <SudokuSolver />
}

export default IndexPage

export const Head: HeadFC = () => (
  <>
    <title>数独ソルバー | 無料オンライン数独解答ツール</title>
    <meta name="description" content="数独を自動で解く無料オンラインツール。問題を入力するだけで、瞬時に解答を表示します。複数の解がある場合も全て表示可能。9x9の数独パズルに対応。" />
    <meta name="keywords" content="数独,ナンプレ,ソルバー,解答,パズル,無料,オンライン,sudoku,solver" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-capable" content="yes" />

    {/* Open Graph / Facebook */}
    <meta property="og:type" content="website" />
    <meta property="og:title" content="数独ソルバー | 無料オンライン数独解答ツール" />
    <meta property="og:description" content="数独を自動で解く無料オンラインツール。問題を入力するだけで、瞬時に解答を表示します。" />

    {/* Twitter */}
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="数独ソルバー | 無料オンライン数独解答ツール" />
    <meta name="twitter:description" content="数独を自動で解く無料オンラインツール。問題を入力するだけで、瞬時に解答を表示します。" />

    {/* Additional SEO */}
    <meta name="robots" content="index, follow" />
    <meta name="language" content="Japanese" />
    <meta name="author" content="数独ソルバー" />
  </>
)
