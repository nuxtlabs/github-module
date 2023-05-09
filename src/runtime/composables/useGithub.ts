import type { ParsedContent } from '@nuxt/content/dist/runtime/types'
import { joinURL } from 'ufo'
import type { GithubRepositoryOptions, GithubContributorsQuery, GithubReleasesQuery, GithubRepository, GithubRawRelease, GithubRawContributor, GithubReleaseQuery, GithubCommitsQuery } from '../types'
import { useRequestEvent } from '#imports'

export const useGithub = () => {
  const _fetch = <Q, T>(base: string) => (query: Q): Promise<T> => {
    const url = joinURL('/api/_github', base, `${encodeParams(query) || 'index'}.json`)

    // add to nitro prerender
    if (process.server) {
      const event = useRequestEvent()
      event.node.res.setHeader(
        'x-nitro-prerender',
        [event.node.res.getHeader('x-nitro-prerender'), url].filter(Boolean).join(',')
      )
    }

    return $fetch(url, { responseType: 'json' })
  }

  return {
    fetchRepository: _fetch<GithubRepositoryOptions, GithubRepository>('repository'),
    fetchReleases: _fetch<GithubReleasesQuery, GithubRawRelease[]>('releases'),
    fetchRelease: _fetch<GithubReleaseQuery, GithubRawRelease>('releases'),
    fetchLastRelease: (query: GithubRepositoryOptions): Promise<GithubRawRelease> =>
      _fetch<GithubRepositoryOptions, GithubRawRelease>('releases')({ ...query, last: true } as any),
    fetchContributors: _fetch<GithubContributorsQuery, GithubRawContributor[]>('contributors'),
    fetchFileContributors: _fetch<GithubContributorsQuery, GithubRawContributor[]>('contributors/file'),
    fetchReadme: _fetch<GithubRepositoryOptions, ParsedContent>('readme'),
    fetchCommits: _fetch<GithubCommitsQuery, any>('commits')
  }
}

function encodeParams (params: any) {
  return Object.entries(params)
    .map(([key, value]) => `${key}_${String(value)}`)
    .join(':')
}
