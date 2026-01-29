import type { GatsbyConfig } from "gatsby"
import * as dotenv from "dotenv"
import * as path from "path"

// Load environment variables from parent directory
dotenv.config({ path: path.join(__dirname, "../.env") })

// Set Gatsby environment variables from loaded .env
process.env.GATSBY_SUDOKU_LEVEL = process.env.SUDOKU_LEVEL || '3'
process.env.GATSBY_SUDOKU_MAX_NUM_SOLUTIONS = process.env.SUDOKU_MAX_NUM_SOLUTIONS || '1000000'
process.env.GATSBY_SUDOKU_MAX_SOLUTIONS = process.env.SUDOKU_MAX_SOLUTIONS || '30'

const config: GatsbyConfig = {
  siteMetadata: {
    title: `数独ソルバー | 無料オンライン数独解答ツール`,
    description: `数独を自動で解く無料オンラインツール。問題を入力するだけで、瞬時に解答を表示します。`,
    siteUrl: `https://sudoku-solver.piyochan.jp`,
  },
  plugins: [
    {
      resolve: 'gatsby-plugin-sitemap',
      options: {
        output: '/',
      },
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
    // Disable potentially problematic features for Node v23 compatibility
    DEV_SSR: false,
    FAST_DEV: false,
    PRESERVE_FILE_DOWNLOAD_CACHE: false,
    PARALLEL_SOURCING: false,
  },
  // Disable date type inference that causes GraphQL schema issues
  mapping: {},
  // Enable GraphQL type generation for type safety
  graphqlTypegen: true
}

export default config
