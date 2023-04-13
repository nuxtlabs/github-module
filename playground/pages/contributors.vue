<script setup lang="ts">
const { owner, repo } = useRuntimeConfig().github

const qOwner = ref('nuxt-modules')
const qRepo = ref('supabase')
</script>

<template>
  <div>
    <GithubContributors v-slot="{ contributors }">
      4 firsts contributors from config: {{ owner }} / {{ repo }}
      <div v-for="contributor in contributors.slice(0, 4)" :key="contributor.login">
        <div :id="contributor.login">
          <img style="height: 32px; width: 32px" :src="contributor.avatar_url">
          {{ contributor.login }}
        </div>
      </div>
    </GithubContributors>

    <br>

    <GithubContributors v-slot="{ contributors, refresh }" :query="{ owner: qOwner, repo: qRepo }">
      4 firsts contributors from query:
      <input v-model="qOwner" style="margin-left: 1rem;" type="text"> /
      <input v-model="qRepo" type="text">
      <button style="margin-left: 1rem;" @click="refresh">
        Search
      </button>
      <div v-for="contributor in contributors.slice(0, 4)" :key="contributor.login">
        <div :id="contributor.login">
          <img style="height: 32px; width: 32px" :src="contributor.avatar_url">
          {{ contributor.login }}
        </div>
      </div>
    </GithubContributors>
  </div>
</template>
