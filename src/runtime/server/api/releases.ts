// import { cachify } from '../utils/cache'
import { useDocusConfig } from 'docus'
import { fetch } from '../utils/github'

// const isProduction = process.env.NODE_ENV === 'production'

// const withCache = (name: string, fn: any) => (isProduction ? cachify(fn, { name, swr: true, ttl: 60000 }) : fn)

// const fetchReleases = withCache('github-releases', () => fetch(config.github))

export default async function githubReleases() {
  const config = useDocusConfig()

  const releases = await fetch(config.github)

  return {
    releases
  }
}
