import { GithubRepositoryOptions } from '.'

export interface GithubCommitsQuery extends GithubRepositoryOptions {
  date?: string
  source?: string
}
