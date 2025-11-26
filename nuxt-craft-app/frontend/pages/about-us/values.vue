<script setup>
import { usePreview } from '@/composables/usePreview'
import { useGraphQL } from '@/composables/useGraphQL'
import { VALUES_QUERY } from '@/queries/values.mjs'
import { useAsyncData } from '#app'

const { isPreview, previewToken, previewTimestamp } = usePreview()
const graphql = useGraphQL()

// Disable SSR for preview mode
if (isPreview.value) {
  definePageMeta({ ssr: false })
}

// Fetch data function
const { data, refresh } = await useAsyncData(
  'values',
  async () => {
    try {
      const result = await graphql.query(VALUES_QUERY, {}, {
        previewToken: previewToken.value
      })
      //return result.entry
      //return { values: result.entry, global: result.globalEntries[0] }
      return JSON.parse(JSON.stringify({
        values: result.entry,
        global: result.globalEntries[0]
      }));
    } catch (error) {
      console.error('Failed to fetch AboutUs-Values data:', error)
      throw createError({ 
        statusCode: 404,
        message: 'AboutUs-Values page not found'
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
const homeImage = data.value.values.sharingImage?.[0]?.url
const globalImage = data.value.global.sharingImage?.[0]?.url

const finalImage = homeImage || globalImage || null

useHead({
  title: data.value.values.metaTitle || data.value.global.metaTitle,
  meta: [
    {
      name: 'description',
      content: data.value.values.metaDescription || data.value.global.metaDescription,
    },
    {
      property: 'og:title',
      content: data.value.values.sharingTitle || data.value.global.sharingTitle,
    },
    {
      property: 'og:url',
      content: data.value.values.url,
    },
    {
      property: 'og:description',
      content: data.value.values.sharingDescription || data.value.global.sharingDescription,
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
      content: data.value.values.url,
    },
    {
      name: 'twitter:title',
      content: data.value.values.sharingTitle || data.value.global.sharingTitle,
    },
    {
      name: 'twitter:description',
      content: data.value.values.sharingDescription || data.value.global.sharingDescription,
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
        data.value.values.defaultRobots !== 'siteDefault'
          ? data.value.values.defaultRobots
          : data.value.global.defaultRobots,
    },
  ],
})

</script>

<template>
  <div :key="previewTimestamp">
    <ValuesHero
      :title="data.values.title"
      :subHeading="data.values.subHeading"
      :caption="data.values.caption"
      :mobileImage="data.values.mobileImage"
      :desktopImage="data.values.desktopImage"
      :heroImage="data.values.heroImage"
      />
    <ValuesHistory
      :mobileImage="data.values.mobileImage2"
      :desktopImage="data.values.desktopImage2"
      :values="data.values.history"
    />
    <ValuesFeatures
      :features="data.values.features"
      :subHeading="data.values.subHeading2"
      :subHeading2="data.values.subHeading3"
      />
    </div>
</template>