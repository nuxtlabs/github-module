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
    const { fetchReadme } = useGithub()

    const { data: readme, refresh, pending } = await useAsyncData(`github-readme-${hash(props.query)}`, () => fetchReadme(props.query))

    return {
      readme,
      refresh,
      pending
    }
  },
  render ({ readme, refresh, pending }) {
    const slots = useSlots()

    return slots?.default?.({ readme, refresh, pending })
  }
})
