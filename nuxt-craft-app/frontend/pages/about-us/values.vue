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