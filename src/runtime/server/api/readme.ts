import { useQuery } from 'h3'
import { overrideConfig, fetchReadme } from '../utils/queries'
import type { ModuleOptions } from '../../../module'
import { GithubRepositoryOptions, GithubRepositoryReadme } from '../../types'
// @ts-ignore
import { parseContent } from '#content/server'
// @ts-ignore
import * as imports from '#imports'

let handler
if (process.env.NODE_ENV === 'development') {
  // @ts-ignore
  // eslint-disable-next-line import/namespace
  handler = imports.defineEventHandler
} else {
  // @ts-ignore
  // eslint-disable-next-line import/namespace
  handler = imports.defineCachedEventHandler
}

export default handler(
  async ({ req }) => {
    const moduleConfig: ModuleOptions = imports.useRuntimeConfig().github

    // Get query
    const query = useQuery(req) as GithubRepositoryOptions

    // Merge query in base config
    const githubConfig = overrideConfig(moduleConfig, query)

    if (!githubConfig.owner || !githubConfig.repo || !githubConfig.api) { return [] }

    // Fetch readme from GitHub
    const readme = await fetchReadme(githubConfig) as GithubRepositoryReadme

    // Readme readable content
    const content = Buffer.from(readme.content, 'base64').toString()

    // Parse contents with @nuxt/content if enabled
    if (moduleConfig.parseContents) {
      // Return parsed content
      return await parseContent(`${githubConfig.owner}:${githubConfig.repo}:readme.md`, content, {
        markdown: {
          remarkPlugins: {
          // Use current Github repository for remark-github plugin
            'remark-github': {
              repository: `${githubConfig.owner}/${githubConfig.repo}`
            }
          }
        }
      })
    }

    return content
  },
  {
    maxAge: 60 // cache for one minute
  }
)
