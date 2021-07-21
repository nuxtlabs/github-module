import { DocusRootNode } from '@docus/core/node'

export interface GithubRelease {
  name: string
  date: number
  body: DocusRootNode
}

export interface GithubRawRelease {
  draft: boolean
  name: string
  // eslint-disable-next-line camelcase
  tag_name: string
  body: string
  // eslint-disable-next-line camelcase
  published_at: number
}

export interface GithubReleaseOptions {
  apiUrl: string
  repo: string
  token: string
  releases?: boolean
}
