import type { ModuleOptions } from '../../../../module'
import { decodeParams, fetchCommits, overrideConfig } from '../../utils/queries'
import { GithubCommitsQuery } from '../../../types'
// @ts-ignore
import * as imports from '#imports'

const moduleConfig: ModuleOptions = imports.useRuntimeConfig().github ?? {}

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
  async (event: any) => {
    // Get query
    const query = decodeParams(event.context.params.query) as GithubCommitsQuery
    const normalizedQuery = {
      ...query,
      date: query.date ? new Date(query.date) : undefined
    }

    // Merge query in module config
    const githubConfig = overrideConfig(moduleConfig, query)

    // Fetch contributors from GitHub
    return await fetchCommits(normalizedQuery, githubConfig)
  },
  {
    maxAge: 60 // cache for one minute
  }
)
