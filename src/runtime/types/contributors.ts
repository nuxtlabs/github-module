import { GithubRepositoryOptions } from '.'

export interface GithubContributorsQuery extends GithubRepositoryOptions {
  source?: string
  max?: string | number
}

export interface GithubRawContributors {
  avatar_url: string
  login: string
  name: string
}
