import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    {
      input: 'src/index.ts',
      name: 'index'
    }
  ],
  declaration: true,
  externals: [
    '@docus/app',
    '@docus/app/kit',
    '@docus/mdc',
    '@docus/remark-mdc',
    '@docus/core',
    '@nuxt/kit',
    'nuxt-i18n',
    '@nuxt/i18n'
  ]
})
