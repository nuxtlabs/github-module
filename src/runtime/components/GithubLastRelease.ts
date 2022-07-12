import { defineComponent, useSlots } from 'vue'
import { useGithub } from '../composables/useGithub'
// @ts-ignore
import { useAsyncData } from '#imports'

export default defineComponent({
  async setup () {
    const { fetchLastRelease } = useGithub()

    const { data: release, refresh, pending } = await useAsyncData('github-last-releases-component', () => fetchLastRelease())

    return {
      release,
      refresh,
      pending
    }
  },
  render ({ release, refresh, pending }) {
    const slots = useSlots()

    return slots?.default?.({ release, refresh, pending })
  }
})
