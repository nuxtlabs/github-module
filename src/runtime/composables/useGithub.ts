import type { ParsedContent } from '@nuxt/content/dist/runtime/types'
import type { GithubRepositoryOptions, GithubContributorsQuery, GithubReleasesQuery, GithubRepository, GithubRawRelease, GithubRawContributor, GithubReleaseQuery } from '../types'
import { useRequestEvent } from '#imports'

export const useGithub = () => {
  const fetchRepository = (query: GithubRepositoryOptions): Promise<GithubRepository> => {
    const url = `/api/_github/repository/${encodeParams(query)}`
    process.server && addPrerenderPath(url)
    return $fetch(url, { responseType: 'json' })
  }

  const fetchRelease = (query: GithubReleaseQuery): Promise<GithubRawRelease> => {
    const url = `/api/_github/releases/${encodeParams(query)}`
    process.server && addPrerenderPath(url)
    return $fetch(url, { responseType: 'json' })
  }

  const fetchLastRelease = (query: GithubRepositoryOptions): Promise<GithubRawRelease> => {
    const url = `/api/_github/releases/${encodeParams({ ...query, last: true })}`
    process.server && addPrerenderPath(url)
    return $fetch(url, { responseType: 'json' })
  }

  const fetchReleases = (query: GithubReleasesQuery): Promise<GithubRawRelease[]> => {
    const url = `/api/_github/releases/${encodeParams(query)}`
    process.server && addPrerenderPath(url)
    return $fetch(url, { responseType: 'json' })
  }

  const fetchContributors = (query: GithubContributorsQuery): Promise<GithubRawContributor[]> => {
    const url = `/api/_github/contributors/${encodeParams(query)}`
    process.server && addPrerenderPath(url)
    return $fetch(url, { responseType: 'json' })
  }

  const fetchFileContributors = (query: GithubContributorsQuery): Promise<GithubRawContributor[]> => {
    const url = `/api/_github/contributors/file/${encodeParams(query)}`
    process.server && addPrerenderPath(url)
    return $fetch(url, { responseType: 'json' })
  }

  const fetchReadme = (query: GithubRepositoryOptions): Promise<ParsedContent> => {
    const url = `/api/_github/readme/${encodeParams(query)}`
    process.server && addPrerenderPath(url)
    return $fetch(url, { responseType: 'json' })
  }

  return {
    fetchRepository,
    fetchReleases,
    fetchRelease,
    fetchLastRelease,
    fetchContributors,
    fetchFileContributors,
    fetchReadme
  }
}

function encodeParams (params: any) {
  return Object.entries(params)
    .map(([key, value]) => `${key}_${String(value)}`)
    .join(':')
}

function addPrerenderPath (path: string) {
  const event = useRequestEvent()
  event.res.setHeader(
    'x-nitro-prerender',
    [
      event.res.getHeader('x-nitro-prerender'),
      path
    ].filter(Boolean).join(',')
  )
}
