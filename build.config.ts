import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    { input: 'src/index.ts', name: 'index' },
    { input: 'src/runtime/index.ts', name: 'runtime' },
    { input: 'src/runtime/server/api/releases.ts', name: 'runtime/server/api/releases' }
  ],
  declaration: true,
  externals: [
    '@docus/app',
    '@docus/app/kit',
    '@docus/mdc',
    '@docus/remark-mdc',
    '@nuxtjs/composition-api',
    '@docus/core/dist/runtime/transformers/index.mjs',
    '@vue/composition-api',
    'vue',
    '@docus/core',
    '@nuxt/kit',
    '@nuxt/i18n',
    '#config',
    '#storage',
    '#app'
  ]
})
