module.exports = {
  parser: '@typescript-eslint/parser',
  env: {
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  plugins: [
    '@typescript-eslint/eslint-plugin'
  ],
  rules: {
    '@typescript-eslint/indent': ['error', 2],
    'eol-last': ['error', 'always'],
    'quotes': ['error', 'single'],
    'space-before-function-paren': ['error', 'never']
  }
}
