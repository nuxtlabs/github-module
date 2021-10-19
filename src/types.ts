import type { MDCRoot } from '@docus/mdc'
// eslint-disable-next-line
import type { DocusConfig } from '@docus/app'

export interface GitHubModuleConfig {
  repo?: string
  branch?: string
  dir?: string
  releases?: string
  url?: string
  apiUrl?: string
}

export interface GithubRelease {
  name: string
  date: number
  body: MDCRoot
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

declare module '@docus/app' {
  interface DocusConfig {
    github?: GitHubModuleConfig
  }
}