import { resolve } from 'path'
import defu from 'defu'
import { addServerMiddleware, defineNuxtModule, resolveModule } from '@nuxt/kit'
import type { Nuxt } from '@nuxt/schema'
import { useDocusConfig } from 'docus'
import { joinURL } from 'ufo'
import githubDefaultConfig from './config'
export * from './types'

export default defineNuxtModule({
  setup(_moduleOptions: any, nuxt: Nuxt) {
    const config = useDocusConfig()

    config.github = defu(config.github, githubDefaultConfig)

    nuxt.options.privateRuntimeConfig.github = config.github

    // @ts-ignore
    nuxt.hook('docus:context', (context: any) => {
      const repository = typeof config.github.releases === 'string' ? config.github.releases : config.github.repo

      if (!repository) {
        // eslint-disable-next-line no-console
        console.warn('In order to use @docus/github, you must specify a repository as a reference for the module.')
        // eslint-disable-next-line no-console
        console.warn('Please use the `github.releases` or `github.repo` key from your docus.config file.')
        throw new Error('Missing repository.')
      }

      context.transformers.markdown.remarkPlugins?.push([
        '@docus/remark-github',
        {
          repository
        }
      ])
    })

    const runtimeDir = resolve(__dirname, 'runtime')

    const resolveApiRoute = (route: string) => {
      const apiBase = nuxt.options.content?.apiBase || '_docus'
      return joinURL('/api', apiBase, route)
    }

    addServerMiddleware({
      route: resolveApiRoute('github-releases'),
      handle: resolveModule('./server/api/releases', { paths: runtimeDir })
    })
  }
})
