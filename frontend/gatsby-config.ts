import type { GatsbyConfig } from "gatsby"
import * as dotenv from "dotenv"
import * as path from "path"

dotenv.config({ path: path.join(__dirname, "../.env") })

process.env.GATSBY_SUDOKU_LEVEL = process.env.SUDOKU_LEVEL || '3'
process.env.GATSBY_SUDOKU_MAX_NUM_SOLUTIONS = process.env.SUDOKU_MAX_NUM_SOLUTIONS || '1000000'
process.env.GATSBY_SUDOKU_MAX_SOLUTIONS = process.env.SUDOKU_MAX_SOLUTIONS || '30'

const config: GatsbyConfig = {
  siteMetadata: {
    title: `数独ソルバー｜複数解にも対応した無料オンライン数独解答ツール`,
    description: `数独を自動で解く無料オンラインソルバー。解が1つに定まらない数独にも対応し、あり得る解の個数や全解一覧を表示できます。`,
    siteUrl: `https://sudoku-solver.piyochan.jp`,
  },
  plugins: [
    {
      resolve: 'gatsby-plugin-sitemap',
      options: { output: '/' },
    },
    {
      resolve: 'gatsby-plugin-robots-txt',
      options: {
        host: 'https://sudoku-solver.piyochan.jp',
        sitemap: 'https://sudoku-solver.piyochan.jp/sitemap-index.xml',
        policy: [{ userAgent: '*', allow: '/' }],
      },
    },
  ],
  flags: {
    DEV_SSR: false,
    FAST_DEV: false,
    PRESERVE_FILE_DOWNLOAD_CACHE: false,
    PARALLEL_SOURCING: false,
  },
  graphqlTypegen: true,
}

export default config
