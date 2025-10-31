<script setup>
import { usePreview } from '@/composables/usePreview'
import { useGraphQL } from '@/composables/useGraphQL'
import { DISTRIBUTION_QUERY } from '@/queries/distribution.mjs'
import { useAsyncData } from '#app'

const { isPreview, previewToken, previewTimestamp } = usePreview()
const graphql = useGraphQL()

// Disable SSR for preview mode
if (isPreview.value) {
  definePageMeta({ ssr: false })
}

// Fetch data function
const { data, refresh } = await useAsyncData(
  'distribution',
  async () => {
    try {
      const result = await graphql.query(DISTRIBUTION_QUERY, {}, {
        previewToken: previewToken.value
      })
      //return result.entry
      //return { distribution: result.entry, global: result.globalEntries[0] }
      return JSON.parse(JSON.stringify({
        distribution: result.entry,
        global: result.globalEntries[0]
      }));
    } catch (error) {
      console.error('Failed to fetch Distribution data:', error)
      throw createError({ 
        statusCode: 404,
        message: 'Distribution page not found'
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
    <DistributionHero
      :title="data.distribution.title"
      :subHeading="data.distribution.subHeading"
      :caption="data.distribution.caption"
      :mobileImage="data.distribution.mobileImage"
      :desktopImage="data.distribution.desktopImage"
      :heroImage="data.distribution.heroImage"
      />
    <DistributionIntro
      :subHeading="data.distribution.subHeading2"
      :subHeading2="data.distribution.subHeading3"
      :caption="data.distribution.caption2"
      :caption2="data.distribution.caption3"
      :heroImage="data.distribution.image"
      :list="data.distribution.list"
      />
    <DistributionFeatures
      :features="data.distribution.features"
      :subHeading="data.distribution.subHeading4"
      :subHeading2="data.distribution.subHeading5"
      />
    <DistributionPromises
    :subHeading="data.distribution.subHeading6"
    :subHeading2="data.distribution.subHeading7"
    :promises="data.distribution.promises"
    />
    <DistributionMap/><!--Static now-->
    <DistributionQuiz
    :subHeading="data.global.subTitle2"
    :subHeading2="data.global.subTitle3"
    :copy="data.global.copy2"
    :buttonCaption="data.global.buttonCaption"
    :information="data.global.information"
    :information2="data.global.information2"
    :subHeading3="data.global.subTitle5"
    :subHeading4="data.global.subTitle4"
    :copy2="data.global.copy3"
    :buttonCaption2="data.global.buttonCaption2"
    :buttonLink="data.global.buttonLink"
    :quizEntries="data.global.quiz"
    />
    </div>
</template>