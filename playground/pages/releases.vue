<script setup lang="ts">
const { owner, repo } = useRuntimeConfig().github

const qOwner = ref('nuxt-modules')
const qRepo = ref('supabase')
</script>

<template>
  <div>
    <GithubReleases v-slot="{ releases }">
      Fetch releases form config: {{ owner }} / {{ repo }}
      <div>
        <span v-for="release in releases" :key="release.name">
          {{ release.name }} /
        </span>
      </div>
    </GithubReleases>

    <br>

    <GithubReleases v-slot="{ releases, refresh }" :query="{ owner: qOwner, repo: qRepo }">
      Fetch releases from query:
      <input v-model="qOwner" style="margin-left: 1rem;" type="text"> /
      <input v-model="qRepo" type="text">
      <button style="margin-left: 1rem;" @click="refresh">
        Search
      </button>
      <div>
        <span v-for="release in releases" :key="release.name">
          {{ release.name }} /
        </span>
      </div>
    </GithubReleases>
  </div>
</template>
