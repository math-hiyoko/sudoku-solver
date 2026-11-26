const js = require('@eslint/js')
const typescript = require('@typescript-eslint/eslint-plugin')
const react = require('eslint-plugin-react')
const reactHooks = require('eslint-plugin-react-hooks')
const globals = require('globals')
const { defineConfig } = require('eslint/config')

module.exports = defineConfig([
  { ignores: ['public/', '.cache/', 'src/gatsby-types.d.ts'] },
  {
    files: ['src/**/*.{js,jsx,ts,tsx}'],
    extends: [
      js.configs.recommended,
      typescript.configs['flat/recommended'],
      react.configs.flat.recommended,
      reactHooks.configs.flat.recommended,
    ],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node, ...globals.jest },
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'no-console': 'warn',
      'no-debugger': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
])
