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
        global: result.globalEntries[0]
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

    </div>
</template>