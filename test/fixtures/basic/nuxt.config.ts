import { defineNuxtConfig } from 'nuxt'
import githubModule from '../../../src/module'

export default defineNuxtConfig({
  modules: ['@nuxt/content', githubModule],
  github: {
    repo: 'nuxt/nuxt.js'
  }
})
