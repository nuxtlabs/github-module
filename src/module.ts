import { fileURLToPath } from 'url'
import { addAutoImport, defineNuxtModule, resolveModule, useLogger } from '@nuxt/kit'

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
      release: options.release === false
        ? false
        : {
            api: options.release.api,
            repo: options.release.repo || options.repo,
            token: options.release.token
          }
    }

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