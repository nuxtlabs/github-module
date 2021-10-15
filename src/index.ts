import { resolve } from 'path'
import defu from 'defu'
import type { DocusContext } from '@docus/core'
import { addServerMiddleware, defineNuxtModule, resolveModule } from '@nuxt/kit'
import type { Nuxt } from '@nuxt/kit'
import { useDocusConfig } from '@docus/app/kit'
import githubDefaultConfig from './config'
import { joinURL } from 'ufo'
export * from './types'

export default defineNuxtModule({
  setup(_moduleOptions: any, nuxt: Nuxt) {
    const config = useDocusConfig()

    config.github = defu(config.github, githubDefaultConfig)

    nuxt.options.privateRuntimeConfig.github = config.github

    nuxt.hook('docus:context', (context: DocusContext) => {
      const repository = typeof config.github.releases === 'string' ? config.github.releases : config.github.repo

      context.transformers.markdown.remarkPlugins?.push([
        'remark-github',
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
