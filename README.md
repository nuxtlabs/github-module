# Github Module

> GitHub integration for [Nuxt](https://v3.nuxtjs.org) & [Content](https://content.nuxtjs.org)

## Setup

Install `@docus/github` in your project:

```bash
# Using Yarn
yarn add --dev @docus/github
# Using NPM
npm install --save-dev @docus/github
```

Then, add `@docus/github` to the `modules` section of your `nuxt.config.ts`:

```ts
import { defineNuxtConfig } from 'nuxt'

export default defineNuxtConfig({
  modules: [
    '@nuxt/content', // Required
    '@docus/github'
  ]
})
```

## Usage

```vue
<script setup lang="ts">
const { data: releases } = await useAsyncData('releases', () => githubReleases())
</script>

<template>
  <div>
    <div v-for="release in releases" :key="release.name">
      <ProseH2 :id="release.name">{{ release.name }}</ProseH2>
      <Content :document="release" />
    </div>
  </div>
</template>
```

## Development

1. Run `npm run dev:prepare` to generate type stubs.
2. Create a [personal access token](https://github.com/settings/tokens) on GitHub and add it into `playground/.env`
  ```env
  GITHUB_TOKEN='<your-personal-token>'
  ```
3. Use `npm run dev` to start [playground](./playground) in development mode.
