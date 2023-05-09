<script setup lang="ts">
const { owner, repo } = useRuntimeConfig().github

const qOwner = ref('nuxt-modules')
const qRepo = ref('supabase')
</script>

<template>
  <div>
    <GithubRepository v-slot="{ repository }">
      Fetch repository from config: {{ owner }} / {{ repo }}
      <div v-if="repository">
        <pre>{{ repository.name }}: {{ repository.description }}</pre>
      </div>
    </GithubRepository>

    <GithubRepository v-slot="{ repository, refresh }" :query="{ owner: qOwner, repo: qRepo }">
      4 firsts contributors from query:
      <input v-model="qOwner" style="margin-left: 1rem;" type="text"> /
      <input v-model="qRepo" type="text">
      <button style="margin-left: 1rem;" @click="refresh">
        Search
      </button>
      <div v-if="repository">
        <pre>{{ repository.name }}: {{ repository.description }}</pre>
      </div>
    </GithubRepository>
  </div>
</template>
