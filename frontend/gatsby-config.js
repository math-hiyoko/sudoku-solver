require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});

module.exports = {
  siteMetadata: {
    title: `Sudoku Solver`,
    description: `Web App to solve Sudoku puzzles`,
    author: `@math_hiyoko`,
    siteUrl: "http://localhost:8000",
  },
  plugins: [
    "gatsby-plugin-styled-components",
    `gatsby-plugin-typescript`,
    {
      resolve: "gatsby-plugin-env-variables",
      options: {
        allowList: ["SUDOKU_DIM"],
      },
    },
  ],
};
