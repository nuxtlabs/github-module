import { defineComponent, useSlots } from 'vue'
import type { PropType } from 'vue'
import { useGithub } from '../composables/useGithub'
import type { GithubContributorsQuery } from '../../module'
import { useAsyncData } from '#imports'

export default defineComponent({
  props: {
    query: {
      type: Object as PropType<GithubContributorsQuery>,
      required: false,
    },
  },
  async setup(props) {
    const { fetchContributors } = useGithub()

    const { data: contributors, refresh, pending } = await useAsyncData('github-contributors-component', () => fetchContributors(props.query))

    return {
      contributors,
      refresh,
      pending,
    }
  },
  render({ contributors, refresh, pending }) {
    const slots = useSlots()

    return slots?.default?.({ contributors, refresh, pending })
  },
})
