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
import { useContent } from '@docus/app'
import { useFetch } from '@nuxtjs/composition-api'
import { defineComponent, ref } from '#app'

export default defineComponent({
  setup() {
    const releases = ref([])

    const $content = useContent()

    useFetch(async () => {
      const { releases: _releases } = await $content.fetch('github-releases')

      releases.value = _releases
    })

    return {
      releases
    }
  }
})
</script>
