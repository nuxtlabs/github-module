import { fileURLToPath } from 'url'
import { addAutoImport, defineNuxtModule, resolveModule } from '@nuxt/kit'

export interface ModuleOptions {
  repo: string,
  release: false | {
    api: string
    repo: string
    token: string
    /**
     * Parse release notes markdown and return AST tree
     *
     * Note: This option is only available when you have `@nuxt/content` installed in your project.
     *
     * @default true
     */
    parse: boolean
  }
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'github-module',
    configKey: 'github'
  },
  defaults: {
    repo: '',
    release: {
      api: 'https://api.github.com/repos',
      repo: '',
      token: undefined,
      parse: true
    }
  },
  setup (options, nuxt) {
    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))

    nuxt.options.runtimeConfig.github = {
      repo: options.repo,
      release: {
        api: options.release === false ? '' : options.release.api,
        repo: options.release === false ? '' : options.release.repo || options.repo,
        token: options.release === false ? '' : options.release.token || process.env.GITHUB_TOKEN,
        parse: options.release === false ? false : options.release.parse
      }
    }

    // @ts-ignore
    // Autolink issue/PR/commit links using `remark-github` plugin
    nuxt.hook('content:context', (context) => {
      context.markdown.remarkPlugins = context.markdown.remarkPlugins || []
      context.markdown.remarkPlugins.push(['remark-github', { repository: (options.release || {}).repo || options.repo }])
    })

    if (options.release !== false) {
      nuxt.options.nitro.handlers = nuxt.options.nitro.handlers || []
      nuxt.options.nitro.handlers.push({
        route: '/api/_github/releases',
        handler: resolveModule('./server/api/releases', { paths: runtimeDir })
      })

      addAutoImport({
        name: 'githubReleases',
        from: resolveModule('./composables/githubReleases', { paths: runtimeDir })
      })
    }
  }
})
