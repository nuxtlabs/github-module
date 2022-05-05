<script setup>
const { data: releases } = await useAsyncData('releases', () => githubReleases())
</script>

<template>
  <div>
    <div v-for="release in releases" :key="release.name">
      <ProseH2 :id="release.name">
        {{ release.name }}
      </ProseH2>

      <Content :document="release" />

      <p>Version: {{ release.v }}</p>

      <p>URL: {{ release.url }}</p>

      <p>Zipball: {{ release.zipall }}</p>

      <p>Tarball: {{ release.tarball }}</p>

      <p>Is prerelease ?: {{ release.prerelease }}</p>

      <p>Reactions: {{ release.reactions }}</p>

      <p>Author: {{ release.author }}</p>
    </div>
  </div>
</template>
