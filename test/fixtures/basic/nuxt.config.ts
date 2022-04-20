import { defineNuxtConfig } from 'nuxt3'
import githubModule from '../../..'

export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    githubModule
  ],
  github: {
    repo: 'nuxt/nuxt.js'
  }
})
