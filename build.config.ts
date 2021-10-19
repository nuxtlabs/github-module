import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    { input: 'src/index.ts', name: 'index' },
    { input: 'src/runtime/server/api/releases.ts', name: 'runtime/server/api/releases' }
  ],
  declaration: true,
  externals: [
    '@docus/app',
    '@docus/app/kit',
    '@docus/mdc',
    '@docus/remark-mdc',
    '@docus/core',
    '@nuxt/kit',
    '@nuxt/i18n',
    '#config',
    '#storage'
  ]
})
