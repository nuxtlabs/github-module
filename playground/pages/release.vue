<script setup lang="ts">
const qOwner = ref('nuxt-community')
const qRepo = ref('supabase-module')
const tag = ref('v0.1.18')
</script>

<template>
  <div>
    <GithubRelease v-slot="{ release, refresh }" :query="{ owner: qOwner, repo: qRepo, tag }">
      Fetch last release from query:
      <div>
        Owner: <input v-model="qOwner" type="text">
      </div>
      <div>
        Repo: <input v-model="qRepo" type="text">
      </div>
      <div>
        Tag: <input v-model="tag" type="text">
      </div>
      <button @click="refresh">
        Search
      </button>
      <div v-if="release">
        <ProseH2 :id="release.name || '#'">
          Release: {{ release.name }}
        </ProseH2>

        <p>Version: {{ release.v }}</p>

        <p>URL: {{ release.url }}</p>

        <p>Zipball: {{ release.zipall }}</p>

        <p>Tarball: {{ release.tarball }}</p>

        <p>Prerelease: {{ release.prerelease }}</p>

        <p>Reactions: {{ release.reactions }}</p>

        <p>Author: {{ release.author }}</p>
      </div>
    </GithubRelease>
  </div>
</template>
