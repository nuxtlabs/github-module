import { overrideConfig, fetchReadme, decodeParams } from '../utils/queries'
import type { ModuleOptions } from '../../../module'
import { GithubRepositoryOptions, GithubRepositoryReadme } from '../../types'
// @ts-ignore
import { addPrerenderPath } from '../utils/prerender'
import { parseContent } from '#content/server'
// @ts-ignore
import * as imports from '#imports'

const moduleConfig: ModuleOptions = imports.useRuntimeConfig().github

let handler
if (process.env.NODE_ENV === 'development' || moduleConfig.disableCache) {
  // @ts-ignore
  // eslint-disable-next-line import/namespace
  handler = imports.defineEventHandler
} else {
  // @ts-ignore
  // eslint-disable-next-line import/namespace
  handler = imports.defineCachedEventHandler
}

export default handler(
  async (event) => {
    addPrerenderPath(event)
    // Get query
    const query = decodeParams(event.context.params.query) as GithubRepositoryOptions

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
