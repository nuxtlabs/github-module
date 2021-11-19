import { joinURL } from 'ufo'
import { useDocusConfig, useDocusContent } from '@docus/app'
// @ts-ignore
import { useFetch } from '@nuxtjs/composition-api'
import { computed, useState } from '#app'

/**
 * GitHub integration helpers.
 */
export function useGitHub() {
  const releases = useState('docus-github-releases', () => [])
  const config = useDocusConfig()

  /**
   * Repository URL computed
   */
  const repoUrl = computed(() => joinURL(config.value.github.url, config.value.github.repo))

  /**
   * Get a page link computed from a page object.
   */
  const getPageLink = (page: any) => {
    const link = computed(() => {
      if (!config.value.github) return

      // TODO: Fix source; regression from split
      const key = page.key.split(':')
      const dir = key[key.length - 2]
      const source = key[key.length - 1]

      return [
        repoUrl.value,
        'edit',
        config.value.github.branch,
        config.value.github.dir || '',
        config.value.contentDir,
        dir,
        `${source}`.replace(/^\//g, '')
      ]
        .filter(Boolean)
        .join('/')
    })

    return link
  }

  const fetchReleases = () => {
    const $content = useDocusContent()

    useFetch(async () => {
      const { releases: _releases } = await $content.fetch('github-releases')

      releases.value = _releases
    })
  }

  return { repoUrl, getPageLink, fetchReleases, releases }
}
