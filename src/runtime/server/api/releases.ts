import { defineEventHandler } from 'h3'
import { useRuntimeConfig, contentParse } from '#nitro'

interface GithubRawRelease {
  draft: boolean
  name: string
  // eslint-disable-next-line camelcase
  tag_name: string
  body: string
  // eslint-disable-next-line camelcase
  published_at: number
}

interface GithubReleaseOptions {
  api: string
  repo: string
  token: string
}

export default defineEventHandler(async () => {
  const { release: releaseConfig } = useRuntimeConfig().github

  // Fetches releases from GitHub
  const githubReleases = await fetchGitHubReleases(releaseConfig)

  // Parse release notes
  const releases = await Promise.all(
    githubReleases.map(async release => ({
      ...release,
      ...(await contentParse(`${release.name}.md`, release.body))
    }))
  )

  // Sort DESC by release version or date
  releases.sort((a, b) => a.v !== b.v ? b.v - a.v : a.date - b.date)

  return releases
})

const normalizeReleaseName = (name: string) => {
  // remove "Release " prefix from release name
  name = name.replace('Release ', '')

  // make sure release name starts with an alphabetical character
  if (!name.match(/^[a-zA-Z]/)) {
    name = `v${name}`
  }
  return name
}

export async function fetchGitHubReleases ({ api, repo, token }: GithubReleaseOptions) {
  const url = `${api}/${repo}/releases`
  const rawReleases = await $fetch<Array<GithubRawRelease>>(url, {
    headers: {
      Authorization: token ? `token ${token}` : undefined
    }
  }).catch((err) => {
    // eslint-disable-next-line no-console
    console.warn(`Cannot fetch GitHub releases on ${url} [${err.response?.status}]`)

    // eslint-disable-next-line no-console
    console.info('Make sure to provide GITHUB_TOKEN environment in `.env`')

    if (err.response.status !== 403) {
      // eslint-disable-next-line no-console
      console.info('To disable fetching releases, set `github.releases` to `false` in `docus.config.js`')
    }

    return []
  })

  return rawReleases
    .filter((r: any) => !r.draft)
    .map((release) => {
      return {
        name: normalizeReleaseName(release.name || release.tag_name),
        v: +normalizeReleaseName(release.tag_name).substring(1, 2),
        date: release.published_at,
        body: release.body
      }
    })
}
