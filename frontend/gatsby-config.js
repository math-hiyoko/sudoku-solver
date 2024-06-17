require("dotenv").config({ path: require('path').resolve(__dirname, "../.env") });

module.exports = {
  siteMetadata: {
    title: `Sudoku Solver`,
    description: `Web App to solve Sudoku puzzles`,
    author: `@math_hiyoko`,
    siteUrl: 'http://localhost:8000',
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-styled-components',
    {
      resolve: 'gatsby-plugin-react-i18next',
      options: {
        localeJsonSourceName: 'locales',
        languages: ['en', 'ja'],
        defaultLanguage: 'en',
        siteUrl: 'http://localhost:8000', 
        i18nextOptions: {
          interpolation: {
            escapeValue: false,
          },
        },
        pages: [
          {
            matchPath: '/:lang?/404',
            getLanguageFromPath: true,
          },
        ],
      },
    },
    {
      resolve: 'gatsby-plugin-env-variables',
      options: {
        allowList: ["SUDOKU_DIM"]
      },
    },
    {
      resolve: 'gatsby-plugin-sitemap',
      options: {
        output: '/sitemap.xml',
      },
    },
    'gatsby-plugin-robots-txt',
    {
      resolve: 'gatsby-plugin-canonical-urls',
      options: {
        siteUrl: 'http://localhost:8000',
      },
    },
  ],
}
