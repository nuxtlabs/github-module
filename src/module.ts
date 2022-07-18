import { defu } from 'defu'
import { addAutoImport, addComponent, createResolver, defineNuxtModule, resolveModule } from '@nuxt/kit'
import type { GithubRepositoryOptions } from './runtime/types'

export interface ModuleOptions extends GithubRepositoryOptions {
  owner?: string
  branch?: string
  repo?: string
  api?: string
  token?: string
  remarkPlugin?: boolean
  releases?: boolean
  contributors?: boolean
  maxContributors?: number
  /**
   * Parse release notes markdown and return AST tree
   *
   * Note: This option is only available when you have `@nuxt/content` installed in your project.
   *
   * @default true
   */
  parseReleases?: boolean
}

declare module '@nuxt/schema' {
  interface PublicRuntimeConfig {
    // @ts-ignore
    github?: ModuleOptions;
  }

  interface RuntimeConfig {
    // @ts-ignore
    github?: ModuleOptions;
  }
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@nuxtlabs/github-module',
    configKey: 'github'
  },
  defaults: {
    owner: '',
    repo: '',
    token: undefined,
    branch: 'main',
    api: 'https://api.github.com',
    remarkPlugin: true,
    releases: true,
    contributors: true,
    maxContributors: 100,
    parseReleases: true
  },
  setup (options, nuxt) {
    const { resolve } = createResolver(import.meta.url)
    const runtimeDir = resolve('./runtime')

    if (!options.owner) {
      // Check if we can split repo name into owner/repo
      if (options.repo && options.repo.includes('/')) {
        const [owner, repo] = options.repo.split('/')
        options.owner = owner
        options.repo = repo
      }
    }

    // @ts-ignore
    if (!nuxt.options.runtimeConfig.public) { nuxt.options.runtimeConfig.public = {} }

    const config = {
      api: options.api || process.env.GITHUB_OWNER,
      owner: options.owner || process.env.GITHUB_OWNER,
      branch: options.branch || process.env.GITHUB_BRANCH,
      repo: options.repo || process.env.GITHUB_REPO,
      token: options.token || process.env.GITHUB_TOKEN,
      parseReleases: options.parseReleases,
      maxContributors: options.maxContributors
    }

    // Public runtime config
    nuxt.options.runtimeConfig.public.github = config
    nuxt.options.runtimeConfig.github = config

    // Autolink issue/PR/commit links using `remark-github` plugin
    if (options.remarkPlugin) {
      // @ts-ignore
      nuxt.hook('content:context', (context) => {
        context.markdown.remarkPlugins = context.markdown.remarkPlugins || {}
        context.markdown.remarkPlugins['remark-github'] = { repository: `${options.owner}/${options.repo}` }
      })
    }

    const nitroConfig = nuxt.options.nitro

    // Init Nitro handlers
    nitroConfig.handlers = nitroConfig.handlers || []
    nitroConfig.prerender = nitroConfig.prerender || {}
    nitroConfig.prerender.routes = nitroConfig.prerender.routes || []

    // Setup repository API
    nitroConfig.handlers.push({
      route: '/api/_github/repository',
      handler: resolveModule('./server/api/repository', { paths: runtimeDir })
    })

    // Repository component
    addComponent({
      name: 'GithubRepository',
      filePath: resolveModule('./components/GithubRepository', { paths: runtimeDir }),
      global: true
    })

    // GithubLink component
    addComponent({
      name: 'GithubLink',
      filePath: resolveModule('./components/GithubLink', { paths: runtimeDir }),
      global: true
    })

    // Setup releases API
    if (options.releases) {
      // Last release (pre-render friendly)
      //
      // Have to use `last-release` instead of `release/last` otherwise pre-rendering will throw
      // an error as the cached file will try to overwrite `/releases` one.
      nitroConfig.handlers.push({
        route: '/api/_github/last-release',
        handler: resolveModule('./server/api/releases/last', { paths: runtimeDir })
      })
      nitroConfig.prerender.routes.push('/api/_github/last-release')

      // Releases list
      nitroConfig.handlers.push({
        route: '/api/_github/releases',
        handler: resolveModule('./server/api/releases/index', { paths: runtimeDir })
      })
      nitroConfig.prerender.routes.push('/api/_github/releases')

      // Releases components
      addComponent({
        name: 'GithubReleases',
        filePath: resolveModule('./components/GithubReleases', { paths: runtimeDir }),
        global: true
      })
      addComponent({
        name: 'GithubLastRelease',
        filePath: resolveModule('./components/GithubLastRelease', { paths: runtimeDir }),
        global: true
      })
    }

    // Setup contributors API
    if (options.contributors) {
      nitroConfig.handlers.push({
        route: '/api/_github/contributors',
        handler: resolveModule('./server/api/contributors', { paths: runtimeDir })
      })
      nitroConfig.prerender.routes.push('/api/_github/contributors')

      // TODO: Add prerender for file arguments (using :source argument)
      nitroConfig.handlers.push({
        route: '/api/_github/contributors/file',
        handler: resolveModule('./server/api/contributors/file', { paths: runtimeDir })
      })

      // Contributors components
      addComponent({
        name: 'GithubContributors',
        filePath: resolveModule('./components/GithubContributors', { paths: runtimeDir }),
        global: true
      })
      addComponent({
        name: 'GithubFileContributors',
        filePath: resolveModule('./components/GithubFileContributors', { paths: runtimeDir }),
        global: true
      })
    }

    addAutoImport({
      name: 'useGithub',
      from: resolveModule('./composables/useGithub', { paths: runtimeDir })
    })

    nitroConfig.externals = defu(typeof nitroConfig.externals === 'object' ? nitroConfig.externals : {}, {
      inline: [
        // Inline module runtime in Nitro bundle
        resolve('./runtime')
      ]
    })
  }
})
