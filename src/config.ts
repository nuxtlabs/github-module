import type { GitHubModuleConfig } from './types'

const githubDefaultConfig: GitHubModuleConfig = {
  repo: undefined,
  branch: undefined,
  dir: undefined,
  releases: undefined,
  url: 'https://github.com',
  apiUrl: 'https://api.github.com/repos'
}

export default githubDefaultConfig
