// Load environment variables from parent directory
require('dotenv').config({ path: require('path').join(__dirname, '../.env') })

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      fallback: {
        "fs": false,
        "crypto": false,
        "stream": false,
        "buffer": false,
        "util": false,
        "lmdb": false,
        "msgpackr": false
      }
    }
  })
}