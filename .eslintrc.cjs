/* eslint-env node */
require('rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  env: {
    'vue/setup-compiler-macros': true,
    node: true,
    browser: true,
    es6: true
  },
  globals: {
    $: 'readonly',
    $$: 'readonly',
    $ref: 'readonly'
  },
  rules: {
    'vue/multi-word-component-names': 0,
    'no-unused-vars': 'warn'
  }
}
