<template>
  <div>
    <div>Docus default app</div>
    <div v-for="release in releases" :key="release.name">
      <ProseH1>{{ release.name }}</ProseH1>
      <DocusContent :document="release" />
    </div>
  </div>
</template>

<script lang="ts">
export default {
  async asyncData({ $docus }) {
    const { releases } = await $docus.data('github-releases')

    return {
      releases
    }
  }
}
</script>
