<script setup>
import { usePreview } from '@/composables/usePreview'
import { useGraphQL } from '@/composables/useGraphQL'
import { BENEFITS_QUERY } from '@/queries/benefits.mjs'
import { useAsyncData } from '#app'

const { isPreview, previewToken, previewTimestamp } = usePreview()
const graphql = useGraphQL()

// Disable SSR for preview mode
if (isPreview.value) {
  definePageMeta({ ssr: false })
}

// Fetch data function
const { data, refresh } = await useAsyncData(
  'benefits',
  async () => {
    try {
      const result = await graphql.query(BENEFITS_QUERY, {}, {
        previewToken: previewToken.value
      })
      //return result.entry
      //return { benefits: result.entry, global: result.globalEntries[0] }
      return JSON.parse(JSON.stringify({
        benefits: result.entry,
        global: result.globalEntries[0]
      }));
    } catch (error) {
      console.error('Failed to fetch AboutUs-Benefits data:', error)
      throw createError({ 
        statusCode: 404,
        message: 'AboutUs-Benefits page not found'
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
const homeImage = data.value.benefits.sharingImage?.[0]?.url
const globalImage = data.value.global.sharingImage?.[0]?.url

const finalImage = homeImage || globalImage || null

useHead({
  title: data.value.benefits.metaTitle || data.value.global.metaTitle,
  meta: [
    {
      name: 'description',
      content: data.value.benefits.metaDescription || data.value.global.metaDescription,
    },
    {
      property: 'og:title',
      content: data.value.benefits.sharingTitle || data.value.global.sharingTitle,
    },
    {
      property: 'og:url',
      content: data.value.benefits.url,
    },
    {
      property: 'og:description',
      content: data.value.benefits.sharingDescription || data.value.global.sharingDescription,
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
      content: data.value.benefits.url,
    },
    {
      name: 'twitter:title',
      content: data.value.benefits.sharingTitle || data.value.global.sharingTitle,
    },
    {
      name: 'twitter:description',
      content: data.value.benefits.sharingDescription || data.value.global.sharingDescription,
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
        data.value.benefits.defaultRobots !== 'siteDefault'
          ? data.value.benefits.defaultRobots
          : data.value.global.defaultRobots,
    },
  ],
})

</script>

<template>
  <div :key="previewTimestamp">
    <BenefitsHero
      :title="data.benefits.title"
      :subHeading="data.benefits.subHeading"
      :caption="data.benefits.caption"
      :mobileImage="data.benefits.mobileImage"
      :desktopImage="data.benefits.desktopImage"
      :heroImage="data.benefits.heroImage"
      />
    <BenefitsIntro
      :subHeading="data.benefits.subHeading2"
      :subHeading2="data.benefits.subHeading3"
      :caption="data.benefits.caption2"
      />
    <BenefitsPromises
       :subHeading="data.benefits.subTitle"
       :subHeading2="data.benefits.caption3"
       :caption="data.benefits.caption4"
       :promises="data.benefits.promises"
    />
    <BenefitsWellbeing
       :subHeading="data.benefits.subHeading4"
       :subHeading2="data.benefits.subHeading5"
       :subHeading3="data.benefits.subHeading6"
       :wellbeing="data.benefits.wellbeing"
    />
    </div>
</template>