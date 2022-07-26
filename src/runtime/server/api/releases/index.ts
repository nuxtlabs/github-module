import { useQuery } from 'h3'
import { fetchReleases, overrideConfig, parseRelease } from '../../utils/queries'
import type { ModuleOptions } from '../../../../module'
import { GithubRawRelease, GithubReleasesQuery } from '../../../types'
// @ts-ignore
import * as imports from '#imports'

const moduleConfig: ModuleOptions = imports.useRuntimeConfig().github

let handler
if (process.env.NODE_ENV === 'development' || moduleConfig.disableCache) {
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
    // Get query
    const query = useQuery(req) as GithubReleasesQuery

    // Merge query in base config
    const githubConfig = overrideConfig(moduleConfig, query)

    if (!githubConfig.owner || !githubConfig.repo || !githubConfig.api) { return [] }

    // Fetches releases from GitHub
    let releases = (await fetchReleases(query, githubConfig)) as (GithubRawRelease | GithubRawRelease[])

    if (!releases) { return }

    // Parse release notes when `parse` option is enabled and `@nuxt/content` is installed.
    if (moduleConfig.parseContents) {
      if (Array.isArray(releases)) {
        releases = await Promise.all(releases.map(release => parseRelease(release, githubConfig)))
      } else {
        return await parseRelease(releases, githubConfig)
      }
    }

    // Sort DESC by release version or date
    return (releases as GithubRawRelease[] || []).sort((a, b) => (a.v !== b.v ? b.v - a.v : a.date - b.date)).filter(Boolean)
  },
  {
    maxAge: 60 // cache for one minute
  }
)
