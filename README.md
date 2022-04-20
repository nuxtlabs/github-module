# Github Module

> GitHub integration.

## Quick Setup

1. Add `@docus/github` dependency to your project:

```bash
# Using Yarn
yarn add --dev @docus/github
# Using NPM
npm install --save-dev @docus/github
```

2. Add `@docus/github` to the `modules` section of your `nuxt.config.ts`

```ts
{
  modules: [
    '@docus/github'
  ]
}
```

> Note: To fetch GitHub releases, you need to install `@nuxt/content` module. 

## Usage

```vue [app.vue]
<template>
  <div>
    <div v-for="release in releases" :key="release.name">
      <ProseH2 :id="release.name">{{ release.name }}</ProseH2>
      <Content :document="release" />
    </div>
  </div>
</template>

<script setup lang="ts">
const { data: releases } = await useAsyncData('releases', () => githubReleases())
</script>

```

## Development

- Run `npm run dev:prepare` to generate type stubs.
- Use `npm run dev` to start [playground](./playground) in development mode.
