import { defineNuxtConfig } from 'nuxt'

export default defineNuxtConfig({
  app: {
  },
  extends: [
    '../node_modules/@nuxt-themes/docus'
  ],
  modules: [
    '../src/module.ts'
  ],
  github: {
    repo: 'nuxt/content'
  },
  components: [
    {
      path: '~/components',
      prefix: '',
      global: true
    }
  ]
})
