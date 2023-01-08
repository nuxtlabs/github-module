<script setup lang="ts">
const runtimeConfig = useRuntimeConfig()

const nav = [
  {
    name: 'Repository',
    path: '/'
  },
  {
    name: 'Readme',
    path: '/readme'
  },
  {
    name: 'Releases',
    path: '/releases'
  },
  {
    name: 'Release by tag',
    path: '/release'
  },
  {
    name: 'Last Release',
    path: '/last-release'
  },
  {
    name: 'Contributors',
    path: '/contributors'
  },
  {
    name: 'File Contributors',
    path: '/file-contributors'
  },
  {
    name: 'Github Link',
    path: '/github-link'
  },
  {
    name: 'Commits',
    path: '/commits'
  }
]
</script>

<template>
  <div>
    <h2>@nuxtlabs/github-module</h2>
    <span>Repository in config: {{ `${runtimeConfig.github?.owner}/${runtimeConfig.github?.repo}` }}</span>

    <div style="width: 100%; height: 100px; display: flex; align-items: center">
      <div v-for="item of nav" :key="item.name" style="margin: 0 1rem">
        <NuxtLink :to="item.path">
          {{ item.name }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
