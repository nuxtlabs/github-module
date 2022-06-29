import { useQuery } from 'h3'
import { fetchReleases, parseRelease } from '../../utils/queries'
import type { GithubReleasesQuery } from '../../../../module'
import { defineCachedEventHandler, useRuntimeConfig } from '#imports'

export default defineCachedEventHandler(
  async ({ req }) => {
    const config = useRuntimeConfig().github

    if (!config.releases) { return [] }

    // Get query
    const query = useQuery(req) as any as GithubReleasesQuery

    // Fetches releases from GitHub
    let releases = await fetchReleases(query, config.releases)

    // Parse release notes when `parse` option is enabled and `@nuxt/content` is installed.
    if (config?.releases?.parse) {
      releases = await Promise.all(releases.map(parseRelease))
    }

    // Sort DESC by release version or date
    releases.sort((a, b) => (a.v !== b.v ? b.v - a.v : a.date - b.date))

    return releases
  },
  {
    maxAge: 60 // cache for one minute
  }
)
