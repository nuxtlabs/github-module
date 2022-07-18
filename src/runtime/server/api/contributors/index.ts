import { useQuery } from 'h3'
import type { ModuleOptions } from '../../../../module'
import { fetchRepositoryContributors, overrideConfig } from '../../utils/queries'
import { GithubContributorsQuery } from '../../../types'
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

    // Fetches releases from GitHub
    const contributors = await fetchRepositoryContributors(query, githubConfig)

    return contributors
  },
  {
    maxAge: 60 // cache for one minute
  }
)
