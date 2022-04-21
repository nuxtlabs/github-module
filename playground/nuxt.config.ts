import { defineNuxtConfig } from 'nuxt'
import githubModule from '..'

export default defineNuxtConfig({
  modules: [
    githubModule,
    '@nuxt/content'
  ],
  github: {
    repo: 'nuxt/nuxt.js'
  }
})
