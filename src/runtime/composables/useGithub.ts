import { withQuery, QueryObject } from 'ufo'
import type { ParsedContent } from '@nuxt/content/dist/runtime/types'
import type { GithubRepositoryOptions, GithubContributorsQuery, GithubReleasesQuery, GithubRepository, GithubRawRelease, GithubRawContributors } from '../types'
export const useGithub = () => {
  const fetchRepository = (query: GithubRepositoryOptions): Promise<GithubRepository> => {
    const url = withQuery('/api/_github/repository', query as QueryObject)
    return $fetch(url, { responseType: 'json' })
  }

  const fetchLastRelease = (query: GithubRepositoryOptions): Promise<GithubRepository> => {
    const url = withQuery('/api/_github/last-release', query as QueryObject)
    return $fetch(url, { responseType: 'json' })
  }

  const fetchReleases = (query: GithubReleasesQuery): Promise<GithubRawRelease> => {
    const url = withQuery('/api/_github/releases', query as QueryObject)
    return $fetch(url, { responseType: 'json' })
  }

  const fetchContributors = (query: GithubContributorsQuery): Promise<GithubRawContributors> => {
    const url = withQuery('/api/_github/contributors', query as QueryObject)
    return $fetch(url, { responseType: 'json' })
  }

  const fetchFileContributors = (query: GithubContributorsQuery): Promise<GithubRawContributors> => {
    const url = withQuery('/api/_github/contributors/file', query as QueryObject)
    return $fetch(url, { responseType: 'json' })
  }

  const fetchReadme = (query: GithubRepositoryOptions): Promise<ParsedContent> => {
    const url = withQuery('/api/_github/readme', query as QueryObject)
    return $fetch(url, { responseType: 'json' })
  }

  return {
    fetchRepository,
    fetchReleases,
    fetchLastRelease,
    fetchContributors,
    fetchFileContributors,
    fetchReadme
  }
}
