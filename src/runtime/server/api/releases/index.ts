import { eventHandler } from 'h3'
import type { H3Event } from 'h3'
import { overrideConfig, decodeParams, fetchReleases, parseRelease } from '../../utils/queries'
import type { GithubRawRelease, GithubReleasesQuery } from '../../../types'
// @ts-ignore
import { useRuntimeConfig, cachedEventHandler } from '#imports'

const moduleConfig = useRuntimeConfig().github || {}

const handler: typeof cachedEventHandler = process.env.NODE_ENV === 'development' || moduleConfig.disableCache ? eventHandler : cachedEventHandler

export default handler(
  async (event: H3Event) => {
    // Get query
    const query = decodeParams(event.context.params?.query) as GithubReleasesQuery

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
