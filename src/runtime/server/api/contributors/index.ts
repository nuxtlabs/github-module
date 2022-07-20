import { useQuery } from 'h3'
import type { ModuleOptions } from '../../../../module'
import { fetchRepositoryContributors, overrideConfig } from '../../utils/queries'
import { GithubContributorsQuery } from '../../../types'
// @ts-ignore
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

// eslint-disable-next-line import/namespace
export default handler(
  async ({ req }) => {
    const moduleConfig: ModuleOptions = imports.useRuntimeConfig().github

    // Get query
    const query = useQuery(req) as GithubContributorsQuery

    // Merge query in module config
    const githubConfig = overrideConfig(moduleConfig, query)

    // Fetch contributors from GitHub
    return await fetchRepositoryContributors(query, githubConfig)
  },
  {
    maxAge: 60 // cache for one minute
  }
)
