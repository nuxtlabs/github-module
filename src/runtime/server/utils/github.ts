import { $fetch, FetchOptions } from 'ohmyfetch/node'
import { getTransformer } from '@docus/core/dist/runtime/transformers/index.mjs'
import { GithubRawRelease, GithubRelease, GitHubModuleConfig } from '../../../types'
import { normalizeReleaseName } from './'
let cachedReleases: GithubRelease[] = []

export function get(): GithubRelease[] {
  return cachedReleases
}

const getMajorVersion = (r: GithubRelease): number => (r.name ? Number(r.name.substring(1, 2)) : 0)

export async function fetch(settings: GitHubModuleConfig) {
  const key = 'content:github-releases.md'

  let releases: GithubRelease[] = []

  const transform = getTransformer(key)

  if (settings.releases) {
    const { apiUrl, repo, releases: releasesRepo } = settings
    const girhubReleases = await fetchGitHubReleases({
      apiUrl,
      repo: typeof releasesRepo === 'string' ? releasesRepo : repo,
      token: process.env.GITHUB_TOKEN || ''
    })
    releases = await Promise.all(
      girhubReleases.map(async r => {
        return {
          ...r,
          ...(await transform(key, r.body))
        }
      })
    )
  }

  releases.sort((a, b) => {
    const aMajorVersion = getMajorVersion(a)
    const bMajorVersion = getMajorVersion(b)
    if (aMajorVersion !== bMajorVersion) {
      return bMajorVersion - aMajorVersion
    }
    return a.date - b.date
  })

  cachedReleases = releases

  return releases
}

export async function fetchGitHubReleases({ apiUrl, repo, token }: GitHubModuleConfig & { token: string }) {
  const options: FetchOptions = {}

  if (token) options.headers = { Authorization: `token ${token}` }

  const url = `${apiUrl}/${repo}/releases`

  /* eslint-disable no-console */
  const rawReleases: GithubRawRelease[] = await $fetch(url, options).catch(err => {
    console.warn(`Cannot fetch GitHub releases on ${url} [${err.response.status}]`)

    console.info('Make sure to provide GITHUB_TOKEN environment in `.env`')

    if (err.response.status !== 403) {
      console.info('To disable fetching releases, set `github.releases` to `false` in `docus.config.js`')
    }

    return []
  })
  /* eslint-disable */

  const releases = rawReleases
    .filter((r: any) => !r.draft)
    .map(release => {
      return {
        name: normalizeReleaseName(release.name || release.tag_name),
        date: release.published_at,
        body: release.body
      }
    })

  return releases
}

export default {
  get,
  fetch,
  fetchGitHubReleases
}
