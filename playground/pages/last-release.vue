<script setup lang="ts">
const { owner, repo } = useRuntimeConfig().github
</script>

<template>
  <div>
    <GithubLastRelease v-slot="{ release }">
      Fetch last release from config: {{ owner }} / {{ repo }}
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
