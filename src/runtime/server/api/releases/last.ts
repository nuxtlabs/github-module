import { useQuery } from 'h3'
import { fetchReleases, overrideConfig, parseRelease } from '../../utils/queries'
import type { ModuleOptions } from '../../../../module'
import { GithubRawRelease, GithubRepositoryOptions } from '../../../types'
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
    const query = useQuery(req) as GithubRepositoryOptions

    // Merge query in base config
    const githubConfig = overrideConfig(moduleConfig, query)

    if (!githubConfig.owner || !githubConfig.repo || !githubConfig.api) { return [] }

    // Fetches releases from GitHub
    let release = await fetchReleases({ last: true }, githubConfig)

    if (release && moduleConfig.parseContents) {
      release = await parseRelease(release as GithubRawRelease, githubConfig)
    }

    return release
  },
  {
    maxAge: 60 // cache for one minute
  }
)
