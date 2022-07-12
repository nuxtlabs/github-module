import { defineNuxtConfig } from 'nuxt'
import colors from 'tailwindcss/colors.js'

export default defineNuxtConfig({
  extends: [
    '../node_modules/@docus/docs-theme'
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
  ],
  tailwindcss: {
    config: {
      theme: {
        extend: {
          colors: {
            primary: colors.pink
          }
        }
      }
    }
  }
})
