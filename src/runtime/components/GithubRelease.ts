import { defineComponent, useSlots, PropType } from 'vue'
import { hash } from 'ohash'
import { useGithub } from '../composables/useGithub'
import { GithubReleaseQuery } from '../types'
// @ts-ignore
import { useAsyncData } from '#imports'

export default defineComponent({
  props: {
    query: {
      type: Object as PropType<GithubReleaseQuery>,
      required: false,
      default: () => ({})
    }
  },
  async setup (props) {
    const { fetchRelease } = useGithub()

    if (!props.query.tag) { return }

    const {
      data: release,
      refresh,
      pending
    } = await useAsyncData(`github-release-${hash(props.query)}`, () => fetchRelease(props.query))

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
