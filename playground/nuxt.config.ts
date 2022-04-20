import { defineNuxtConfig } from 'nuxt3'
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
