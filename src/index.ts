import { resolve } from 'path'
import defu from 'defu'
import { DocusContext, resolveApiRoute } from '@docus/core'
import { addServerMiddleware, defineNuxtModule, Nuxt, resolveModule } from '@nuxt/kit'
import { useDocusSettings } from '@docus/app'
import githubDefaults from './settings'

export default defineNuxtModule({
  setup(_moduleOptions: any, nuxt: Nuxt) {
    const settings = useDocusSettings()

    settings.github = defu(settings.github, githubDefaults)
    nuxt.options.privateRuntimeConfig.github = settings.github
    nuxt.hook('docus:context', (context: DocusContext) => {
      const repository = typeof settings.github.releases === 'string' ? settings.github.releases : settings.github.repo
      context.transformers.markdown.remarkPlugins.push([
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

    // nuxt.hook('modules:done', () => {
    //   // Fetch releases
    //   fetch(settings.github).then(releases => {
    //     const storage = useStorage()

    //     storage?.setItem('data:github-releases', {
    //       releases
    //     })
    //   })
    // })
  }
})
