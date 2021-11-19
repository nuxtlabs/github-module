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
import { useGitHub } from '../../src/runtime/index'
import { defineComponent } from '#app'

export default defineComponent({
  setup() {
    const { releases, fetchReleases } = useGitHub()

    fetchReleases()

    return {
      releases
    }
  }
})
</script>
