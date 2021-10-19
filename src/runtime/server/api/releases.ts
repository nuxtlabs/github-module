import { cachify } from '../utils/cache'
import { fetch } from '../utils/github'
// @ts-ignore
import config from '#config'

const isProduction = process.env.NODE_ENV === 'production'

const withCache = (name: string, fn: any) => (isProduction ? cachify(fn, { name, swr: true, ttl: 60000 }) : fn)

const fetchReleases = withCache('github-releases', () => fetch(config.github))

export default async function githubReleases() {
  const releases = await fetchReleases()

  return {
    releases
  }
}
