# Github Module

> GitHub integration for [Nuxt](https://v3.nuxtjs.org) & [Content](https://content.nuxtjs.org)

## Setup

Install `@nuxtlabs/github-module` in your project:

```bash
# Using Yarn
yarn add --dev @nuxtlabs/github-module
# Using NPM
npm install --save-dev @nuxtlabs/github-module
```

Then, add `@nuxtlabs/github-module` to the `modules` section of your `nuxt.config.ts`:

```ts
import { defineNuxtConfig } from 'nuxt'

export default defineNuxtConfig({
  modules: [
    '@nuxt/content', // Required
    '@nuxtlabs/github-module'
  ],
  github: {
    repo: 'nuxt/framework' // Or use GITHUB_REPO in .env
  }
})
```

Lastly, create a [personal access token](https://github.com/settings/tokens) on GitHub and add it into your `.env`:

```env
GITHUB_TOKEN='<your-personal-token>'
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

## Options

```ts
github: {
  repo: string,
  releases: false | {
    api: string
    repo: string
    token: string
    /**
     * Parse release notes markdown and return AST tree
     *
     * Note: This option is only available when you have `@nuxt/content` installed in your project.
     *
     * @default true
     */
    parse: boolean
  }
}
```

## Development

1. Run `npm run dev:prepare` to generate type stubs.
2. Create a [personal access token](https://github.com/settings/tokens) on GitHub and add it into `playground/.env`
  ```env
  GITHUB_TOKEN='<your-personal-token>'
  ```
3. Use `npm run dev` to start [playground](./playground) in development mode.
