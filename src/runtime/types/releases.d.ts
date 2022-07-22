import { GithubRepositoryOptions } from '.'

export interface GithubReleaseQuery extends GithubRepositoryOptions {
  tag?: string
}

export interface GithubReleasesQuery extends GithubReleaseQuery {
  per_page?: string
  page?: string
  last?: boolean
}

export interface GithubRawRelease {
  name: string
  body: string
  v: number
  tag_name: string
  date: number
  url: string
  tarball: string
  zipball: string
  prerelease: boolean
  reactions: Array<any>
  author: {
    name: string
    url: string
    avatar: string
  }
}
