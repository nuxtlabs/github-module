import { Module } from '@nuxt/types'
import defu from 'defu'
import { useStorage, DocusContext } from '@docus/core'
import { fetch } from './github'
import githubDefaults from './settings'

export default <Module>function docusGithubModule() {
  const { nuxt } = this
  const { hook } = nuxt
  const settings = this.$docus.settings

  settings.github = defu(settings.github, githubDefaults)

  hook('docus:context', (context: DocusContext) => {
    const repository = typeof settings.github.releases === 'string' ? settings.github.releases : settings.github.repo
    context.transformers.markdown.remarkPlugins.push([
      'remark-github',
      {
        repository
      }
    ])
  })

  hook('modules:done', () => {
    // Fetch releases
    fetch(settings.github).then(releases => {
      const storage = useStorage()

      storage?.setItem('data:github-releases', {
        releases
      })
    })
  })
}
