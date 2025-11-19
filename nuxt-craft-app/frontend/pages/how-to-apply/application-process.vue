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