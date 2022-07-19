<script setup lang="ts">
const qOwner = ref('nuxt-community')
const qRepo = ref('supabase-module')
</script>

<template>
  <div>
    <GithubReadme v-slot="{ readme, refresh }" :query="{ owner: qOwner, repo: qRepo }">
      Fetch readme from query:
      <input v-model="qOwner" style="margin-left: 1rem;" type="text"> /
      <input v-model="qRepo" type="text">
      <button style="margin-left: 1rem;" @click="refresh">
        Search
      </button>
      <ContentRenderer :value="readme" />
    </GithubReadme>
  </div>
</template>
