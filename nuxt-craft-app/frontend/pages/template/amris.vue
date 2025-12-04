<script setup>
import { usePreview } from '@/composables/usePreview'
import { useGraphQL } from '@/composables/useGraphQL'
import { AMRIS_QUERY } from '@/queries/amris.mjs'
import { useAsyncData } from '#app'

const { isPreview, previewToken, previewTimestamp } = usePreview()
const graphql = useGraphQL()

// Disable SSR for preview mode
if (isPreview.value) {
  definePageMeta({ ssr: false })
}

// Fetch data function
const { data, refresh } = await useAsyncData(
  'amris',
  async () => {
    try {
      const result = await graphql.query(AMRIS_QUERY, {}, {
        previewToken: previewToken.value
      })
      //return result.entry
      //return { amris: result.entry, global: result.globalEntries[0] }
      return JSON.parse(JSON.stringify({
        amris: result.entry,
        global: result.globalEntries[0]
      }));
    } catch (error) {
      console.error('Failed to fetch Amris Process data:', error)
      throw createError({ 
        statusCode: 404,
        message: 'Amris page not found'
      })
    }
  },
  {
    watch: [previewToken]
  }
)

watch([isPreview, previewToken], () => {
  if (isPreview.value && previewToken.value) {
    refresh()
  }
})

// --- SEO & Sharing Meta Tags ---
const homeImage = data.value.amris.sharingImage?.[0]?.url
const globalImage = data.value.global.sharingImage?.[0]?.url

const finalImage = homeImage || globalImage || null

useHead({
  title: `${data.value.amris.metaTitle || data.value.global.metaTitle} - [AMRIS title]`,
  meta: [
    {
      name: 'description',
      content: data.value.amris.metaDescription || data.value.global.metaDescription,
    },
    {
      property: 'og:title',
      content: data.value.amris.sharingTitle || data.value.global.sharingTitle,
    },
    {
      property: 'og:url',
      content: data.value.amris.url,
    },
    {
      property: 'og:description',
      content: data.value.amris.sharingDescription || data.value.global.sharingDescription,
    },
    ...(finalImage
      ? [
          {
            property: 'og:image',
            content: finalImage,
          },
        ]
      : []),
    {
      name: 'twitter:card',
      content: 'summary_large_image',
    },
    {
      name: 'twitter:site',
      content: data.value.amris.url,
    },
    {
      name: 'twitter:title',
      content: data.value.amris.sharingTitle || data.value.global.sharingTitle,
    },
    {
      name: 'twitter:description',
      content: data.value.amris.sharingDescription || data.value.global.sharingDescription,
    },
    ...(finalImage
      ? [
          {
            name: 'twitter:image',
            content: finalImage,
          },
        ]
      : []),
    {
      name: 'robots',
      content:
        data.value.amris.defaultRobots !== 'siteDefault'
          ? data.value.amris.defaultRobots
          : data.value.global.defaultRobots,
    },
  ],
})

definePageMeta({
  layout: 'amris'
})

</script>

<template :key="previewTimestamp">
    <AmrisHero
      :title="data.amris.title"
      :heroImage="data.amris.heroImage"
      />
    <section> 
					<div class="container container-md">
						<div class="card">
[AMRIS content]
            </div>
          </div>
    </section>
</template>