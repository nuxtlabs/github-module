import { cachify } from '../utils/cache'
import { fetch } from '../utils/github'
import privateConfig from '#config'

const fetchReleases = cachify(() => fetch(privateConfig.docus.github), {
  name: 'releases',
  swr: true,
  ttl: 60000,
  integrity: 'github'
})

export default async function githubReleases() {
  const releases = await fetchReleases()

  return {
    releases
  }
}
