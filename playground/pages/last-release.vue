<template>
  <div>
    <!-- Fetch repository from config:
    <GithubLastRelease v-slot="{ release }">
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
    </GithubLastRelease> -->

    Fetch repository from query: {{ owner }} / {{ repo }}
    <GithubLastRelease v-slot="{ release }" :query="{ owner, repo }">
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

<script setup lang="ts">
const owner = 'nuxt-community'
const repo = 'supabase-module'
</script>
