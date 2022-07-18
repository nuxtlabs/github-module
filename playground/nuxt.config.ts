import { defineNuxtConfig } from 'nuxt'
import githubModule from '../src/module'

export default defineNuxtConfig({
  modules: [githubModule, '@nuxt/content'],
  github: {
    repo: 'nuxt/content'
  }
})
