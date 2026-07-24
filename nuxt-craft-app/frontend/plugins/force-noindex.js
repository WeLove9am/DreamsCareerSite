import { defineHeadPlugin } from 'unhead/plugins'

export default defineNuxtPlugin({
  name: 'force-noindex',
  enforce: 'pre',
  setup() {
    const config = useRuntimeConfig()

    if (!config.public.noindex) {
      return
    }

    const head = injectHead()

    head.use(defineHeadPlugin({
      hooks: {
        'tags:resolve': ({ tags }) => {
          for (const tag of tags) {
            if (tag.tag === 'meta' && tag.props.name === 'robots') {
              tag.props.content = 'noindex, nofollow'
            }
          }
        }
      }
    }))
  }
})
