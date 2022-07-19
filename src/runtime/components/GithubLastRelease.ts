import { defineComponent, useSlots, PropType } from 'vue'
import { hash } from 'ohash'
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
    const { fetchLastRelease } = useGithub()

    const { data: release, refresh, pending } = await useAsyncData(`github-last-release-${hash(props.query)}`, () => fetchLastRelease(props.query))

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
