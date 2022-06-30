import { withQuery } from 'ufo'

export const useGithub = () => {
  const fetchRepository = () => $fetch('/api/_github/repository', { responseType: 'json' })

  const fetchLastRelease = () => $fetch('/api/_github/last-release', { responseType: 'json' })

  const fetchReleases = (query: any) => {
    const url = withQuery('/api/_github/releases', query as any)
    return $fetch(url, { responseType: 'json' })
  }

  const fetchContributors = (query: any) => {
    const url = withQuery('/api/_github/contributors', query as any)
    return $fetch(url, { responseType: 'json' })
  }

  const fetchFileContributors = (source = '', query: any) => {
    const url = withQuery('/api/_github/contributors/file', { ...query, source } as any)
    return $fetch(url, { responseType: 'json' })
  }

  return {
    fetchRepository,
    fetchReleases,
    fetchLastRelease,
    fetchContributors,
    fetchFileContributors
  }
}
