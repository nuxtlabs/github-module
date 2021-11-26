import { joinURL } from 'ufo'
import { useDocusConfig, useDocusContent } from '#docus'
import { computed, useState, useLazyAsyncData } from '#app'

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
   * Generate a table of content from releases
   */
  const toc = computed(() =>
    releases.value.map((release: any) => ({
      id: release.name,
      depth: 2,
      text: release.name
    }))
  )

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

  /**
   * GitHub releases fetching helper.
   * To be used from a component setup().
   */
  const fetchReleases = () => {
    const $content = useDocusContent()

    const { data } = useLazyAsyncData('fetch-github-releases', async () => {
      const { releases } = await $content.fetch('github-releases')

      return releases
    })

    releases.value = data
  }

  return { repoUrl, getPageLink, fetchReleases, releases, toc }
}
