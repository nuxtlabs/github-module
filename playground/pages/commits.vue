<script setup lang="ts">
import { ref } from 'vue'

const qOwner = ref('nuxt-community')
const qRepo = ref('supabase-module')
const file = ref('package.json')
const date = ref('2022-06-30')
</script>

<template>
  <div>
    <GithubCommits v-slot="{ commits, refresh }" :query="{ owner: qOwner, repo: qRepo, source: file, date }">
      <div style="margin-bottom: .5rem;">
        Repo: <input v-model="qOwner" type="text"> / <input v-model="qRepo" type="text">
      </div>
      <div style="margin-bottom: .5rem;">
        File: <input v-model="file" type="text">
      </div>
      <div style="margin-bottom: .5rem;">
        From date: <input v-model="date" type="text">
      </div>
      <button @click="refresh">
        Search
      </button>

      <h3>Commit List</h3>
      <em v-if="!commits.length">No commit found</em>
      <div v-for="commit in commits" :key="commit.hash" style="display: flex; margin: 1rem 0">
        <a :href="`https://github.com/${qOwner}/${qRepo}/commit/${commit.hash}`" target="_blank">
          <code>{{ commit.hash.slice(0, 7) }}</code>
        </a>
        <span style="margin: 0 .5rem;">-</span>
        <span>
          <span v-html="commit.message" />

          <div v-for="{ login, name } in commit.authors" :key="login">
            committed by <a :href="`https://github.com/${login}`" target="_blank">{{ name }}</a>
          </div>
        </span>
      </div>
    </GithubCommits>
  </div>
</template>
