<template>
  <div>
    <!-- Fetch from config:
    <GithubContributors v-slot="{ contributors }">
      <div v-for="contributor in contributors" :key="contributor.login">
        <div :id="contributor.login">
          <img style="height: 32px; width: 32px" :src="contributor.avatar_url">
          {{ contributor.login }}
        </div>
      </div>
    </GithubContributors> -->

    Fetch contributors from query: {{ owner }} / {{ repo }}
    <GithubContributors v-slot="{ contributors }" :query="{ owner, repo }">
      <div v-for="contributor in contributors" :key="contributor.login">
        <div :id="contributor.login">
          <img style="height: 32px; width: 32px" :src="contributor.avatar_url">
          {{ contributor.login }}
        </div>
      </div>
    </GithubContributors>
  </div>
</template>

<script setup lang="ts">
const owner = 'nuxt-community'
const repo = 'supabase-module'
</script>
