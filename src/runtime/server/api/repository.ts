import { fetchRepository, overrideConfig } from '../utils/queries'
import { GithubRepositoryOptions, ModuleOptions } from '../../../module'
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

    // Fetches releases from GitHub
    const repository = await fetchRepository(githubConfig)

    return repository
  },
  {
    maxAge: 60 // cache for one minute
  }
)
