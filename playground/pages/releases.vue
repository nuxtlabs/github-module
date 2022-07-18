<template>
  <div>
    <!-- Fetch releases form config:
    <GithubReleases v-slot="{ releases }">
      <div v-for="release in releases" :key="release.name">
        <ProseH2 :id="release.name">
          {{ release.name }}
        </ProseH2>

        <p>Version: {{ release.v }}</p>

        <p>URL: {{ release.url }}</p>

        <p>Zipball: {{ release.zipall }}</p>

        <p>Tarball: {{ release.tarball }}</p>

        <p>Is prerelease ?: {{ release.prerelease }}</p>

        <p>Reactions: {{ release.reactions }}</p>

        <p>Author: {{ release.author }}</p>
      </div>
    </GithubReleases> -->

    Fetch releases from query: {{ owner }} / {{ repo }}
    <GithubReleases v-slot="{ releases }" :query="{ owner, repo }">
      <div v-for="release in releases" :key="release.name">
        <ProseH2 :id="release.name">
          {{ release.name }}
        </ProseH2>

        <p>Version: {{ release.v }}</p>

        <p>URL: {{ release.url }}</p>

        <p>Zipball: {{ release.zipall }}</p>

        <p>Tarball: {{ release.tarball }}</p>

        <p>Is prerelease ?: {{ release.prerelease }}</p>

        <p>Reactions: {{ release.reactions }}</p>

        <p>Author: {{ release.author }}</p>
      </div>
    </GithubReleases>
  </div>
</template>

<script setup lang="ts">
const owner = 'nuxt-community'
const repo = 'supabase-module'
</script>
