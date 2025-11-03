<script setup>
import { usePreview } from '@/composables/usePreview'
import { useGraphQL } from '@/composables/useGraphQL'
import { FAQ_QUERY } from '@/queries/faq.mjs'
import { useAsyncData } from '#app'

const { isPreview, previewToken, previewTimestamp } = usePreview()
const graphql = useGraphQL()

// Disable SSR for preview mode
if (isPreview.value) {
  definePageMeta({ ssr: false })
}

// Fetch data function
const { data, refresh } = await useAsyncData(
  'faqs',
  async () => {
    try {
      const result = await graphql.query(FAQ_QUERY, {}, {
        previewToken: previewToken.value
      })
      //return result.entry
      //return { faqs: result.entry, global: result.globalEntries[0] }
      return JSON.parse(JSON.stringify({
        faqs: result.entry,
        global: result.globalEntries[0]
      }));
    } catch (error) {
      console.error('Failed to fetch FAQs Process data:', error)
      throw createError({ 
        statusCode: 404,
        message: 'FAQs page not found'
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

// --- CONSOLE LOGS START HERE ---
console.log('--- Full Data Payload ---', JSON.stringify(data.value, null, 2));
console.log('FAQs Entry Data:', JSON.stringify(data.value?.faqs, null, 2));
console.log('Global Entry Data:', JSON.stringify(data.value?.global, null, 2));
// --- CONSOLE LOGS END HERE ---
</script>

<template>
  <div :key="previewTimestamp">
    <FaqHero
      :title="data.faqs.title"
      :subHeading="data.faqs.subHeading"
      :caption="data.faqs.caption"
      :mobileImage="data.faqs.mobileImage"
      :desktopImage="data.faqs.desktopImage"
      :heroImage="data.faqs.heroImage"
      />
    <FaqItems
       :subTitle="data.faqs.subTitle"
       :caption="data.faqs.caption2"
       :copy="data.faqs.copy"
       :qands="data.faqs.qands"
    />
    </div>
</template>