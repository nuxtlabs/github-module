import { defineComponent, useSlots, PropType } from 'vue'
import { useGithub } from '../composables/useGithub'
// @ts-ignore
import { GithubRepositoryOptions } from '../types'
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
    const { fetchLastRelease } = useGithub()

    const { data: release, refresh, pending } = await useAsyncData('github-last-releases-component', () => fetchLastRelease(props.query))

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
