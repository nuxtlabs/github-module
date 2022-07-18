import { joinURL, withQuery, QueryObject } from 'ufo'
import { graphql } from '@octokit/graphql'
import { defu } from 'defu'
import type {
  ModuleOptions
} from '../../../module'
import { GithubRawRelease, GithubRepositoryOptions, GithubRawContributors, GithubContributorsQuery, GithubReleasesQuery } from '../../types'
import { parseContent } from '#content/server'
function isBot (user) {
  return user.login.includes('[bot]') || user.login.includes('-bot') || user.login.includes('.bot')
}

function normalizeRelease (release: any): GithubRawRelease {
  return {
    name: normalizeReleaseName(release?.name || release?.tag_name),
    tag_name: release?.tag_name,
    date: release?.published_at,
    body: release?.body,
    v: +normalizeReleaseName(release?.tag_name)?.substring(1, 2) || 0,
    url: release?.html_url,
    tarball: release?.tarball_url,
    zipball: release?.zipball_url,
    prerelease: release?.prerelease,
    reactions: release?.reactions,
    author: {
      name: release?.author?.login,
      url: release?.author?.html_url,
      avatar: release?.author?.avatar_url
    }
  }
}

function normalizeReleaseName (name: string) {
  if (!name) { return '' }

  // remove "Release " prefix from release name
  name = name.replace('Release ', '')

  // make sure release name starts with an alphabetical character
  if (!name.match(/^[a-zA-Z]/)) {
    name = `v${name}`
  }

  return name
}

export function githubGraphqlQuery<T = any> (query: string, options: Partial<ModuleOptions>): Promise<T> {
  const gq = graphql.defaults({
    headers: {
      authorization: `token ${options.token}`
    }
  })

  return gq<T>(query)
}

export const parseRelease = async (release: GithubRawRelease) => {
  return {
    ...release,
    // Parse release notes when `@nuxt/content` is installed.
    ...(typeof parseContent === 'function' && release?.body && release?.name ? await parseContent(`github:${release.name}.md`, release.body) : {})
  }
}

export function overrideConfig (config: ModuleOptions, query: GithubRepositoryOptions): GithubRepositoryOptions {
  return (
    ({ owner, repo, branch, api, token }) =>
      ({ owner, repo, branch, api, token }))(defu(query, config))
}

export async function fetchRepository ({ api, owner, repo, token }: GithubRepositoryOptions) {
  const url = `${api}/repos/${owner}/${repo}`

  const repository = await $fetch<Array<GithubRawContributors>>(url, {
    headers: {
      Authorization: token ? `token ${token}` : undefined
    }
  }).catch((_) => {
    /*

    // eslint-disable-next-line no-console
    console.warn(`Cannot fetch GitHub Repository on ${url} [${err.response?.status || 500}]`)

    // eslint-disable-next-line no-console
    console.info('If your repository is private, make sure to provide GITHUB_TOKEN environment in `.env`')

    */

    return {}
  })

  return repository
}

export async function fetchRepositoryContributors ({ max }: Partial<GithubContributorsQuery>, { api, owner, repo, token }: GithubRepositoryOptions) {
  let url = `${api}/repos/${owner}/${repo}/contributors`

  url = withQuery(url, { max } as QueryObject)

  const contributors = await $fetch<Array<GithubRawContributors>>(url, {
    headers: {
      Authorization: token ? `token ${token}` : undefined
    }
  }).catch((_) => {
    /*

    // eslint-disable-next-line no-console
    console.warn(`Cannot fetch GitHub contributors on ${url} [${err.response?.status || 500}]`)

    // eslint-disable-next-line no-console
    console.info('If your repository is private, make sure to provide GITHUB_TOKEN environment in `.env`')

    if (err?.response?.status !== 403) {
      // eslint-disable-next-line no-console
      console.info('To disable fetching contributors, set `github.contributors` to `false` in `nuxt.config.ts`')
    }

    */

    return []
  })

  // eslint-disable-next-line camelcase
  return contributors.map(({ avatar_url, login }) => ({ avatar_url, login }))
}

export async function fetchFileContributors ({ source, max }: Partial<GithubContributorsQuery>, { owner, repo, branch, token }: GithubRepositoryOptions & { maxContributors?: number }) {
  const data = await githubGraphqlQuery(
    `
  query {
    repository(owner: "${owner}", name: "${repo}") {
      object(expression: "${branch}") {
        ... on Commit {
          history(first: ${max}, path: "${source}") {
            nodes {
              authors(first: ${max}) {
                nodes {
                  user {
                    name
                    avatarUrl
                    login
                  }
                }
              }
            }
          }
        }
      }
    }
  }`,
    { token }
  ).catch((_) => {
    /*

    // eslint-disable-next-line no-console
    console.warn(`Cannot fetch GitHub file contributors on ${source} [${err.response?.status || 500}]`)

    // eslint-disable-next-line no-console
    console.info('If your repository is private, make sure to provide GITHUB_TOKEN environment in `.env`')

    if (err?.response?.status !== 403) {
      // eslint-disable-next-line no-console
      console.info('To disable fetching contributors, set `github.contributors` to `false` in `nuxt.config.ts`')
    }

    */
  })

  if (!data?.repository?.object?.history?.nodes) { return [] }

  let users = data.repository.object.history.nodes
    .map(node => node.authors.nodes)
    .flat()
    .map(node => node.user)
    .filter(user => user && user.name)
    .filter(user => !isBot(user))

  // Unique
  users = users.reduce((unique, user) => (unique.find(u => u.login === user.login) ? unique : unique.concat(user)), [])

  return users.map(({ avatarUrl, name, login }) => ({ avatar_url: avatarUrl, name, login }))
}

export async function fetchReleases (query: Partial<GithubReleasesQuery>, { api, repo, token, owner }: GithubRepositoryOptions) {
  const page = query?.page || 1
  const perPage = query?.per_page || 100
  const last = query?.last || false
  const tag = query?.tag || false

  let url = `${api}/repos/${owner}/${repo}/releases`
  if (tag) {
    url = joinURL(url, 'tags', tag)
  } else if (last) {
    url = joinURL(url, 'latest')
  } else {
    url = withQuery(url, { per_page: perPage, page } as any)
  }

  const rawReleases = await $fetch<Array<GithubRawRelease>>(url, {
    headers: {
      Authorization: token ? `token ${token}` : undefined
    }
  }).catch((_) => {
    /*

    // eslint-disable-next-line no-console
    console.warn(`Cannot fetch GitHub releases on ${url} [${err.response?.status || 500}]`)

    // eslint-disable-next-line no-console
    console.info('If your repository is private, make sure to provide GITHUB_TOKEN environment in `.env`')

    if (err.response.status !== 403) {
      // eslint-disable-next-line no-console
      console.info('To disable fetching releases, set `github.releases` to `false` in `nuxt.config.ts`')
    }

    */
  })

  if (!rawReleases) { return last ? {} : [] }

  const releases = last ? normalizeRelease(rawReleases) : rawReleases.filter((r: any) => !r.draft).map(normalizeRelease)

  return releases
}
