import { useQuery } from 'h3'
import { fetchReleases, parseRelease } from '../../utils/queries'
import type { GithubRawRelease, GithubReleasesQuery } from '../../../../module'
import * as imports from '#imports'

let handler
if (process.env.NODE_ENV === 'development') {
  // @ts-ignore
  // eslint-disable-next-line import/namespace
  handler = imports.defineEventHandler
} else {
  // @ts-ignore
  // eslint-disable-next-line import/namespace
  handler = imports.defineCachedEventHandler
}

export default handler(
  async ({ req }) => {
    const config = imports.useRuntimeConfig().github

    if (!config.releases) { return [] }

    // Get query
    const query = useQuery(req) as any as GithubReleasesQuery

    // Fetches releases from GitHub
    let releases = (await fetchReleases(query, config.releases)) as GithubRawRelease[]

    if (!releases) { return }

    // Parse release notes when `parse` option is enabled and `@nuxt/content` is installed.
    if (config?.releases?.parse) {
      releases = await Promise.all(releases.map(parseRelease))
    }

    // Sort DESC by release version or date
    releases = (releases || []).sort((a, b) => (a.v !== b.v ? b.v - a.v : a.date - b.date))

    return releases
  },
  {
    maxAge: 60 // cache for one minute
  }
)
