module.exports = {
  root: true,
  extends: ['plugin:vue/vue3-essential', 'eslint:recommended'],
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
