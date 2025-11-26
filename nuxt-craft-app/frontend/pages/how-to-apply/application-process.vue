<script setup>
import { usePreview } from '@/composables/usePreview'
import { useGraphQL } from '@/composables/useGraphQL'
import { APPLICATION_QUERY } from '@/queries/application.mjs'
import { useAsyncData } from '#app'

const { isPreview, previewToken, previewTimestamp } = usePreview()
const graphql = useGraphQL()

// Disable SSR for preview mode
if (isPreview.value) {
  definePageMeta({ ssr: false })
}

// Fetch data function
const { data, refresh } = await useAsyncData(
  'application',
  async () => {
    try {
      const result = await graphql.query(APPLICATION_QUERY, {}, {
        previewToken: previewToken.value
      })
      //return result.entry
      //return { application: result.entry, global: result.globalEntries[0] }
      return JSON.parse(JSON.stringify({
        application: result.entry,
        global: result.globalEntries[0],
        jobs: result.jobListEntries
      }));
    } catch (error) {
      console.error('Failed to fetch Application Process data:', error)
      throw createError({ 
        statusCode: 404,
        message: 'Application Process page not found'
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

//Get 10 random jobs
const randomJobs = computed(() => {
  const allJobs = data.value?.jobs || []
  return [...allJobs]
    .sort(() => Math.random() - 0.5) // shuffle
    .slice(0, 10) // take first 10
})

// --- SEO & Sharing Meta Tags ---
const homeImage = data.value.application.sharingImage?.[0]?.url
const globalImage = data.value.global.sharingImage?.[0]?.url

const finalImage = homeImage || globalImage || null

useHead({
  title: data.value.application.metaTitle || data.value.global.metaTitle,
  meta: [
    {
      name: 'description',
      content: data.value.application.metaDescription || data.value.global.metaDescription,
    },
    {
      property: 'og:title',
      content: data.value.application.sharingTitle || data.value.global.sharingTitle,
    },
    {
      property: 'og:url',
      content: data.value.application.url,
    },
    {
      property: 'og:description',
      content: data.value.application.sharingDescription || data.value.global.sharingDescription,
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
      content: data.value.application.url,
    },
    {
      name: 'twitter:title',
      content: data.value.application.sharingTitle || data.value.global.sharingTitle,
    },
    {
      name: 'twitter:description',
      content: data.value.application.sharingDescription || data.value.global.sharingDescription,
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
        data.value.application.defaultRobots !== 'siteDefault'
          ? data.value.application.defaultRobots
          : data.value.global.defaultRobots,
    },
  ],
})

</script>

<template>
  <div :key="previewTimestamp">
    <ApplicationprocessHero
      :title="data.application.title"
      :subHeading="data.application.subHeading"
      :caption="data.application.caption"
      :mobileImage="data.application.mobileImage"
      :desktopImage="data.application.desktopImage"
      :heroImage="data.application.heroImage"
      />
    <ApplicationprocessProcess
       :subTitle="data.application.subTitle"
       :steps="data.application.application"
    />
    <ApplicationprocessJobcard 
    :jobs="randomJobs"
    :subTitle="data.application.subTitle2"
    :buttonCaption="data.application.buttonCaption"
    :subTitle2="data.application.subTitle3"
    :buttonCaption2="data.application.buttonCaption2"
    />

    </div>
</template>