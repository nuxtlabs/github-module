import { defineTheme } from '@nuxt-themes/config'

export default defineTheme(
  {
    title: 'GitHub Module',
    description: 'Integrate your GitHub repository informations in your Nuxt app.',
    layout: 'docs',
    url: 'https://nuxt-github-module.netlify.app',
    debug: false,
    socials: {
      twitter: '@nuxt_js',
      github: 'nuxtlabs/github-module'
    },
    cover: {
      src: '/cover.png'
    },
    github: {
      root: 'docs/content',
      edit: true,
      releases: true
    },
    aside: {
      level: 0
    },
    header: {
      logo: true
    },
    footer: {
      credits: {
        icon: 'IconDocus',
        text: 'Powered by Docus',
        href: 'https://docus.com'
      },
      icons: [
        {
          label: 'NuxtJS',
          href: 'https://nuxtjs.org',
          component: 'IconNuxt'
        },
        {
          label: 'Vue Telescope',
          href: 'https://vuetelescope.com',
          component: 'IconVueTelescope'
        }
      ]
    }
  }
)
