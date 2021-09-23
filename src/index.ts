import { resolve } from 'path'
import defu from 'defu'
import { DocusContext, resolveApiRoute } from '@docus/core'
import { addServerMiddleware, defineNuxtModule, Nuxt, resolveModule } from '@nuxt/kit'
import { useDocusConfig } from '@docus/app/kit'
import githubDefaultConfig from './config'

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

    addServerMiddleware({
      route: resolveApiRoute('github-releases'),
      handle: resolveModule('./server/api/releases', { paths: runtimeDir })
    })
  }
})
