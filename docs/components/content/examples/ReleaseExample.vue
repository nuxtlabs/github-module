<template>
  <GithubRelease v-slot="{ release }" :query="{ tag: 'v0.0.1' }">
    {{ release.name }}
  </GithubRelease>
</template>
