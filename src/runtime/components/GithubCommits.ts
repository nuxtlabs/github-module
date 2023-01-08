import { defineComponent, useSlots } from 'vue'
import type { PropType } from 'vue'
import { hash } from 'ohash'
import { useGithub } from '../composables/useGithub'
import { GithubCommitsQuery } from '../types'
// @ts-ignore
import { useAsyncData } from '#imports'

export default defineComponent({
  props: {
    query: {
      type: Object as PropType<GithubCommitsQuery>,
      required: false,
      default: () => ({})
    }
  },
  async setup (props) {
    const { fetchCommits } = useGithub()

    const { data: commits, pending, refresh } = await useAsyncData(`github-commits-${hash(props.query)}`, () => fetchCommits(props.query))
    return {
      commits,
      pending,
      refresh
    }
  },
  render ({ commits, pending, refresh }) {
    const slots = useSlots()
    return slots?.default?.({ commits, pending, refresh })
  }
})
