<script setup lang="ts">
const qOwner = ref('nuxt-community')
const qRepo = ref('supabase-module')
</script>

<template>
  <div>
    <GithubReadme v-slot="{ readme, refresh }" :query="{ owner: qOwner, repo: qRepo }">
      Fetch README from query:
      <input v-model="qOwner" style="margin-left: 1rem;" type="text"> /
      <input v-model="qRepo" type="text">
      <button style="margin-left: 1rem;" @click="refresh">
        Search
      </button>
      <ContentRenderer :value="readme">
        <template #empty>
          <div style="margin: 1rem 0">
            README not found
          </div>
        </template>
      </ContentRenderer>
    </GithubReadme>
  </div>
</template>
