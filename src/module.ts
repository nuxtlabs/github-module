import { fileURLToPath } from 'url'
import { addAutoImport, defineNuxtModule, resolveModule, useLogger } from '@nuxt/kit'

export interface ModuleOptions {
  repo: string,
  release: false | {
    api: string
    repo: string
    token: string
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
      token: undefined
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
      if (!nuxt.options.modules.includes('@nuxt/content')) {
        useLogger('github-module').warn('To fetch GitHub releases, you need to install `@nuxt/content` module')
        useLogger('github-module').info('To disable fetching releases, set `github.releases` to `false` in `docus.config.js`')
        useLogger('github-module').info('To install `@nuxt/content`, run `npm install @nuxt/content`')
      } else {
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
  }
})
