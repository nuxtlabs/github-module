import type { ModuleOptions } from '../../../../module'
import { decodeParams, fetchFileContributors, overrideConfig } from '../../utils/queries'
import { GithubContributorsQuery } from '../../../types'
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
  async (event) => {
    // Get query
    const query = decodeParams(event.context.params.query) as GithubContributorsQuery

    // Merge query in module config
    const githubConfig = overrideConfig(moduleConfig, query)

    // Use max from config if not send in query
    query.max = query.max ? Number(query.max) : moduleConfig.maxContributors

    // Fetch contributors from GitHub
    return await fetchFileContributors(query, githubConfig)
  },
  {
    maxAge: 60 // cache for one minute
  }
)
