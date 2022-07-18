import { defineComponent, useSlots, PropType } from 'vue'
import { useGithub } from '../composables/useGithub'
import { GithubRepositoryOptions } from '../types'
// @ts-ignore
import { useAsyncData } from '#imports'

export default defineComponent({
  props: {
    query: {
      type: Object as PropType<GithubRepositoryOptions>,
      required: false,
      default: () => ({})
    }
  },
  async setup (props) {
    const { fetchRepository } = useGithub()

    const { data: repository, refresh, pending } = await useAsyncData('github-repository-component', () => fetchRepository(props.query))

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
