import { fetchRepository, overrideConfig } from '../utils/queries'
import { ModuleOptions } from '../../../module'
import { GithubRepository, GithubRepositoryOptions } from '../../types'
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
    const query = useQuery(req) as GithubRepositoryOptions

    // Merge query in module config
    const githubConfig = overrideConfig(moduleConfig, query)

    // Fetch repository from GitHub
    return await fetchRepository(githubConfig) as GithubRepository
  },
  {
    maxAge: 60 // cache for one minute
  }
)
