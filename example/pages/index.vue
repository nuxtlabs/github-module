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
import { defineComponent } from '@nuxtjs/composition-api'
import { useContent } from '@docus/app'

export default defineComponent({
  async asyncData() {
    const content = useContent()

    const { releases } = await content.fetch('github-releases')

    return {
      releases
    }
  }
})
</script>
