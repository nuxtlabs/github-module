import * as imports from '#imports'

interface GithubRawRelease {
  draft: boolean
  name: string
  // eslint-disable-next-line camelcase
  tag_name: string
  body: string
  // eslint-disable-next-line camelcase
  published_at: number
}

interface GithubReleasesOptions {
  api: string
  repo: string
  token: string
}

export default cachedEventHandler(async () => {
  const { releases: releasesConfig } = imports.useRuntimeConfig().github

  // Fetches releases from GitHub
  let releases = await fetchGitHubReleases(releasesConfig)

  // Parse release notes when `parse` option is enabled and `@nuxt/content` is installed.
  // eslint-disable-next-line import/namespace
  if (releasesConfig.parse && typeof imports.contentParse === 'function') {
    releases = await Promise.all(
      releases.map(async release => ({
        ...release,
        // eslint-disable-next-line import/namespace
        ...(await imports.contentParse(`${release.name}.md`, release.body))
      }))
    )
  }

  // Sort DESC by release version or date
  releases.sort((a, b) => a.v !== b.v ? b.v - a.v : a.date - b.date)

  return releases
}, {
  maxAge: 60 // cache for one minute
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

export async function fetchGitHubReleases ({ api, repo, token }: GithubReleasesOptions) {
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
      console.info('To disable fetching releases, set `github.releases` to `false` in `nuxt.config.ts`')
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
