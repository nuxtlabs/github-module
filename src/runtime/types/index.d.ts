export * from './repository'
export * from './releases'
export * from './contributors'
export * from './commits'


export interface GithubAuthor {
  name: string
  login: string
  avatarUrl: string
}