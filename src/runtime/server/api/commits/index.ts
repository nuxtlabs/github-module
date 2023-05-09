import { eventHandler } from 'h3'
import type { H3Event } from 'h3'
import { overrideConfig, decodeParams, fetchCommits } from '../../utils/queries'
import type { GithubCommitsQuery } from '../../../types'
// @ts-ignore
import { useRuntimeConfig, cachedEventHandler } from '#imports'

const moduleConfig = useRuntimeConfig().github || {}

const handler: typeof cachedEventHandler = process.env.NODE_ENV === 'development' || moduleConfig.disableCache ? eventHandler : cachedEventHandler

export default handler(
  async (event: H3Event) => {
    // Get query
    const query = decodeParams(event.context.params?.query) as GithubCommitsQuery
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
