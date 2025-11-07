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