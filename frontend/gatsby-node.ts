import type { GatsbyNode } from "gatsby"
import * as dotenv from "dotenv"
import * as path from "path"

// Load environment variables from parent directory
dotenv.config({ path: path.join(__dirname, "../.env") })

export const onCreateWebpackConfig: GatsbyNode["onCreateWebpackConfig"] = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      fallback: {
        "fs": false,
        "crypto": false,
        "stream": false,
        "buffer": false,
        "util": false,
        "lmdb": false,
        "msgpackr": false,
        "path": false
      }
    }
  })
}