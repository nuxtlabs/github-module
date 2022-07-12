import { defineComponent, useSlots } from 'vue'
import { useGithub } from '../composables/useGithub'
// @ts-ignore
import { useAsyncData } from '#imports'

export default defineComponent({
  async setup () {
    const { fetchRepository } = useGithub()

    const { data: repository, refresh, pending } = await useAsyncData('github-repository-component', () => fetchRepository())

    return {
      repository,
      refresh,
      pending
    }
  },
  render ({ repository, refresh, pending }) {
    const slots = useSlots()

    return slots?.default?.({ repository, refresh, pending })
  }
})
