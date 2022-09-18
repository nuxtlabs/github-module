import { joinURL } from 'ufo'
import type { PropType } from 'vue'
import { computed, defineComponent, useSlots } from 'vue'
// @ts-ignore
import { useRuntimeConfig } from '#imports'

export default defineComponent({
  props: {
    /**
     * Repository owner.
     */
    owner: {
      type: String,
      default: () => useRuntimeConfig()?.github?.owner,
      required: false
    },
    /**
     * Repository name.
     */
    repo: {
      type: String,
      default: () => useRuntimeConfig()?.github?.repo,
      required: false
    },
    /**
     * The branch to use for the edit link.
     */
    branch: {
      type: String,
      default: () => useRuntimeConfig()?.github?.branch,
      required: false
    },
    /**
     * A base directory to append to the source path.
     *
     * Won't be used if `page` is set.
     */
    dir: {
      type: String,
      default: () => useRuntimeConfig()?.github?.dir,
      required: false
    },
    /**
     * Source file path.
     *
     * Won't be used if `page` is set.
     */
    source: {
      type: String,
      required: false,
      default: undefined
    },
    /**
     * Use page from @nuxt/content.
     */
    page: {
      type: Object as PropType<any>,
      required: false,
      default: undefined
    },
    /**
     * Content directory (to be used with `page`)
     */
    contentDir: {
      type: String,
      required: false,
      default: 'content'
    },
    /**
     * Send to an edit page or not.
     */
    edit: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  setup (props) {
    if (!props.owner || !props.repo || !props.branch) {
      throw new Error('If you want to use `GithubLink` component, you must specify: `owner`, `repo` and `branch`.')
    }

    // eslint-disable-next-line vue/no-setup-props-destructure
    let { repo, owner, branch, contentDir } = props
    let prefix = ''
    const { sources } = useRuntimeConfig().content
    let source
    for (const key in Object.keys(sources)) {
      if (props.page._id.startsWith(key)) {
        source = sources[key]
        break
      }
    }

    if (source?.driver === 'github') {
      repo = source.repo
      owner = ''
      branch = source.branch || 'main'
      contentDir = source.dir || ''
      prefix = source.prefix || ''
    }

    const base = computed(() => joinURL('https://github.com', `${owner}/${repo}`))

    const path = computed(() => {
      const dirParts: string[] = []

      // @nuxt/content support
      // Create the URL from a document data.
      if (props?.page?._path) {
        // Use content dir
        if (contentDir) { dirParts.push(contentDir) }

        // Get page file from page data
        dirParts.push(props.page._file.substring(prefix.length))

        return dirParts
      }

      // Use props dir
      if (props.dir) {
        dirParts.push(props.dir)
      }

      // Use props source
      if (props.source) {
        dirParts.push(props.source)
      }

      return dirParts
    })

    /**
     * Create edit link.
     */
    const url = computed(() => {
      const parts = [base.value]

      if (props.edit) { parts.push('edit') } else { parts.push('tree') }

      parts.push(branch, ...path.value)

      return parts.filter(Boolean).join('/')
    })

    return {
      url
    }
  },
  render (ctx) {
    const { url } = ctx

    const slots = useSlots()

    return slots?.default?.({ url })
  }
})
