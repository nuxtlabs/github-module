import { defineNuxtConfig } from 'nuxt'

export default defineNuxtConfig({
  extends: [
    '@nuxt-themes/docus'
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
            primary: {
              DEFAULT: '#4183C4',
              50: '#CDDEF0',
              100: '#BED4EB',
              200: '#9EC0E1',
              300: '#7FACD7',
              400: '#6097CE',
              500: '#4183C4',
              600: '#31679C',
              700: '#234B72',
              800: '#162F47',
              900: '#09121C'
            }
          }
        }
      }
    }
  }
})
