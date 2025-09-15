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
    title: `数独ソルバー`,
    siteUrl: `https://www.yourdomain.tld`,
  },
  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin
  // Learn more at: https://gatsby.dev/graphql-typegen
  graphqlTypegen: true,
  plugins: [],
  flags: {
    // Disable potentially problematic features for Node v23 compatibility
    DEV_SSR: false,
    FAST_DEV: false,
    PRESERVE_FILE_DOWNLOAD_CACHE: false,
    PARALLEL_SOURCING: false,
  }
}

export default config
