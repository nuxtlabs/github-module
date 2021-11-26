import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    { input: 'src/index.ts', name: 'index' },
    { input: 'src/runtime/index.ts', name: 'runtime' },
    { input: 'src/runtime/server/api/releases.ts', name: 'runtime/server/api/releases' }
  ],
  declaration: true,
  externals: [
    '@nuxt/schema',
    'docus',
    '#docus',
    '@docus/mdc',
    '@docus/remark-mdc',
    '@nuxtjs/composition-api',
    'docus/dist/runtime/transformers/index.mjs',
    '@vue/composition-api',
    'vue',
    '@nuxt/kit',
    '@nuxt/i18n',
    '#config',
    '#storage',
    '#app'
  ]
})
