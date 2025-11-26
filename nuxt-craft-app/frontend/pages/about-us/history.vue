<script setup>
import { usePreview } from '@/composables/usePreview'
import { useGraphQL } from '@/composables/useGraphQL'
import { ABOUT_QUERY } from '@/queries/about.mjs'
import { useAsyncData } from '#app'

const { isPreview, previewToken, previewTimestamp } = usePreview()
const graphql = useGraphQL()

// Disable SSR for preview mode
if (isPreview.value) {
  definePageMeta({ ssr: false })
}

// Fetch data function
const { data, refresh } = await useAsyncData(
  'about',
  async () => {
    try {
      const result = await graphql.query(ABOUT_QUERY, {}, {
        previewToken: previewToken.value
      })
      //return result.entry
      //return { about: result.entry, global: result.globalEntries[0] }
      return JSON.parse(JSON.stringify({
        about: result.entry,
        global: result.globalEntries[0]
      }));
    } catch (error) {
      console.error('Failed to fetch AboutUs-History data:', error)
      throw createError({ 
        statusCode: 404,
        message: 'AboutUs-History page not found'
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

definePageMeta({
  layout: 'application'
})

// --- SEO & Sharing Meta Tags ---
const homeImage = data.value.about.sharingImage?.[0]?.url
const globalImage = data.value.global.sharingImage?.[0]?.url

const finalImage = homeImage || globalImage || null

useHead({
  title: data.value.about.metaTitle || data.value.global.metaTitle,
  meta: [
    {
      name: 'description',
      content: data.value.about.metaDescription || data.value.global.metaDescription,
    },
    {
      property: 'og:title',
      content: data.value.about.sharingTitle || data.value.global.sharingTitle,
    },
    {
      property: 'og:url',
      content: data.value.about.url,
    },
    {
      property: 'og:description',
      content: data.value.about.sharingDescription || data.value.global.sharingDescription,
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
      content: data.value.about.url,
    },
    {
      name: 'twitter:title',
      content: data.value.about.sharingTitle || data.value.global.sharingTitle,
    },
    {
      name: 'twitter:description',
      content: data.value.about.sharingDescription || data.value.global.sharingDescription,
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
        data.value.about.defaultRobots !== 'siteDefault'
          ? data.value.about.defaultRobots
          : data.value.global.defaultRobots,
    },
  ],
})

</script>

<template>
  <div :key="previewTimestamp">
    <AboutHero
      :title="data.about.title"
      :subHeading="data.about.subHeading"
      :caption="data.about.caption"
      :vimeoVideoId="data.about.vimeoVideoId"
      :mobileImage="data.about.mobileImage"
      :desktopImage="data.about.desktopImage"
      :heroImage="data.about.heroImage"
      />
    <AboutIntro
      :subHeading="data.about.subHeading2"
      :subHeading2="data.about.subHeading3"
      :caption="data.about.caption2"
      :caption2="data.about.caption3"
      />
    <AboutHistory
       :history="data.about.history"
    />
    <AboutPartner
       :subTitle="data.about.subTitle"
       :copy="data.about.copy"
       :copy2="data.about.copy2"
       :image="data.about.image"
       :image2="data.about.image2"
       :image3="data.about.image3"
    />
    </div>
</template>