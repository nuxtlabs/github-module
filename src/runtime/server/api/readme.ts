import { eventHandler } from 'h3'
import type { H3Event } from 'h3'
import { overrideConfig, fetchReadme, decodeParams } from '../utils/queries'
import type { GithubRepositoryOptions, GithubRepositoryReadme } from '../../types'
// @ts-ignore
import { useRuntimeConfig, cachedEventHandler } from '#imports'

const moduleConfig = useRuntimeConfig().github || {}

const handler: typeof cachedEventHandler = process.env.NODE_ENV === 'development' || moduleConfig.disableCache ? eventHandler : cachedEventHandler

export default handler(async (event: H3Event) => {
  // Get query
  const query = decodeParams(event.context.params?.query) as GithubRepositoryOptions

  // Merge query in base config
  const githubConfig = overrideConfig(moduleConfig, query)

  if (!githubConfig.owner || !githubConfig.repo || !githubConfig.api) { return [] }

  // Fetch readme from GitHub
  const readme = await fetchReadme(githubConfig) as GithubRepositoryReadme

  // Readme readable content
  const content = Buffer.from(readme.content ?? '', 'base64').toString()

  // Parse contents with @nuxt/content if enabled
  if (moduleConfig.parseContents) {
    // @ts-ignore
    const markdown = await import('@nuxt/content/transformers/markdown').then(m => m.default || m)
    // Return parsed content
    return await markdown.parse(`${githubConfig.owner}:${githubConfig.repo}:readme.md`, content, {
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
