<script setup lang="ts">
const owner = 'nuxt-community'
const repo = 'supabase-module'
</script>

<template>
  <!-- Fetch readme from config:
  <GithubReadme v-slot="{ readme }">
    <ContentRenderer :value="readme" />
  </GithubReadme> -->

  Fetch readme from query: {{ owner }} / {{ repo }}
  <GithubReadme v-slot="{ readme }" :query="{ owner, repo}">
    <ContentRenderer :value="readme" />
  </GithubReadme>
</template>
