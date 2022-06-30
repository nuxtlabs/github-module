import { fetchReleases, parseRelease } from '../../utils/queries'
import type { GithubRawRelease } from '../../../../module'
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
  async () => {
    const config = imports.useRuntimeConfig().github

    if (!config.releases) { return [] }

    // Fetches releases from GitHub
    let release = await fetchReleases({ last: true }, config.releases)

    if (release && config?.releases?.parse) {
      release = await parseRelease(release as GithubRawRelease)
    }

    return release
  },
  {
    maxAge: 60 // cache for one minute
  }
)
