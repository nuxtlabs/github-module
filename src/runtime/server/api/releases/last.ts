import { fetchReleases, overrideConfig, parseRelease } from '../../utils/queries'
import type { ModuleOptions } from '../../../../module'
import { GithubRawRelease, GithubRepositoryOptions } from '../../../types'
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
    const moduleConfig: ModuleOptions = imports.useRuntimeConfig().github

    // Get query
    const query = useQuery(req) as GithubRepositoryOptions

    // Merge query in base config
    const githubConfig = overrideConfig(moduleConfig, query)

    if (!githubConfig.owner || !githubConfig.repo || !githubConfig.api) { return [] }

    // Fetches releases from GitHub
    let release = await fetchReleases({ last: true }, githubConfig)

    if (release && moduleConfig.parseReleases) {
      release = await parseRelease(release as GithubRawRelease)
    }

    return release
  },
  {
    maxAge: 60 // cache for one minute
  }
)
