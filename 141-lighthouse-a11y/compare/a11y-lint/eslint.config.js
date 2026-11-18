// The Vue starter's ESLint rules for .vue files (eslint-plugin-vue's essential ones), with the recommended rules of
// eslint-plugin-vuejs-accessibility added: a community plugin (vue-a11y), not part of create-vue's starter.
import pluginVue from 'eslint-plugin-vue'
import pluginVueA11y from 'eslint-plugin-vuejs-accessibility'

export default [
  ...pluginVue.configs['flat/essential'],
  ...pluginVueA11y.configs['flat/recommended'],
]
