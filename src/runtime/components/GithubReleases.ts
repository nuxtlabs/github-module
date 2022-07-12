import { defineComponent, ref, useSlots } from 'vue'
import type { PropType } from 'vue'
import { hash } from 'ohash'
import { useGithub } from '../composables/useGithub'
import type { GithubReleasesQuery } from '../../module'
// @ts-ignore
import { useAsyncData, useState } from '#imports'

export default defineComponent({
  props: {
    query: {
      type: Object as PropType<GithubReleasesQuery>,
      required: false,
      default: undefined
    }
  },
  async setup (props) {
    const { fetchReleases } = useGithub()

    const id = `github-releases-component-${hash(props.query)}`

    const { data: _releases, refresh, pending } = await useAsyncData(id, () => fetchReleases(props.query))

    // TODO: remove this painful workaround: hotfix for https://github.com/vuejs/core/issues/5513
    // @ts-ignore - Workaround
    const releases = process.client ? useState(id) : ref()
    releases.value = releases.value || _releases.value

    return {
      releases,
      refresh,
      pending
    }
  },
  render ({ releases, refresh, pending }) {
    const slots = useSlots()

    return slots?.default?.({ releases, refresh, pending })
  }
})
