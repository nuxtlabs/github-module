<script setup lang="ts">
const qOwner = ref('nuxt-modules')
const qRepo = ref('supabase')
</script>

<template>
  <div>
    <GithubLastRelease v-slot="{ release, refresh }" :query="{ owner: qOwner, repo: qRepo }">
      Fetch last release from query:
      <input v-model="qOwner" style="margin-left: 1rem;" type="text"> /
      <input v-model="qRepo" type="text">
      <button style="margin-left: 1rem;" @click="refresh">
        Search
      </button>
      <div v-if="release">
        <ProseH2 :id="release.name || '#'">
          Last Release: {{ release.name }}
        </ProseH2>

        <p>Version: {{ release.v }}</p>

        <p>URL: {{ release.url }}</p>

        <p>Zipball: {{ release.zipall }}</p>

        <p>Tarball: {{ release.tarball }}</p>

        <p>Prerelease: {{ release.prerelease }}</p>

        <p>Reactions: {{ release.reactions }}</p>

        <p>Author: {{ release.author }}</p>
      </div>
    </GithubLastRelease>
  </div>
</template>
