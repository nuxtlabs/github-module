import { useQuery } from 'h3'
import type { GithubContributorsQuery } from '../../../../module'
import { fetchFileContributors } from '../../utils/queries'
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
    const config = imports.useRuntimeConfig().github

    // Get query
    const query = useQuery(req) as any as GithubContributorsQuery

    // Fetches releases from GitHub
    const contributors = await fetchFileContributors(query, config.contributors)

    return contributors
  },
  {
    maxAge: 60 // cache for one minute
  }
)
