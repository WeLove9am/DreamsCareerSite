<script setup>
import { usePreview } from '@/composables/usePreview'
import { useGraphQL } from '@/composables/useGraphQL'
import { BEDQUARTERS_QUERY } from '@/queries/bedquarters.mjs'
import { useAsyncData } from '#app'


import { useRouter } from 'vue-router'

const router = useRouter()

// Clean up before leaving
router.beforeEach((to, from, next) => {
  if (from.path === '/' && to.path !== '/') {
    // Leaving home page, clean up
    cleanupAnimations()
  }
  next()
})

function cleanupAnimations() {
  if (process.client && window.ScrollTrigger) {
    const { ScrollTrigger } = useGsap()
    ScrollTrigger.getAll().forEach(st => st.kill())
  }
}

const { isPreview, previewToken, previewTimestamp } = usePreview()
const graphql = useGraphQL()

// Disable SSR for preview mode
if (isPreview.value) {
  definePageMeta({ ssr: false })
}

// Fetch data function
const { data, refresh } = await useAsyncData(
  'bedquarters',
  async () => {
    try {
      const result = await graphql.query(BEDQUARTERS_QUERY, {}, {
        previewToken: previewToken.value
      })
      //return result.entry
      //return { bedquarters: result.entry, global: result.globalEntries[0] }
      return JSON.parse(JSON.stringify({
        bedquarters: result.entry,
        global: result.globalEntries[0]
      }));
    } catch (error) {
      console.error('Failed to fetch Retail data:', error)
      throw createError({ 
        statusCode: 404,
        message: 'Retail page not found'
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
//console.log('Global Data:', JSON.stringify(data.value?.global, null, 2))
//console.log('Retail Page Data:', JSON.stringify(data.value, null, 2))
//console.log(data.value?.global?.subTitle2);
</script>

<template>
  <div :key="previewTimestamp">
    <BedquartersHero
      :title="data.bedquarters.title"
      :subHeading="data.bedquarters.subHeading"
      :caption="data.bedquarters.caption"
      :mobileImage="data.bedquarters.mobileImage"
      :desktopImage="data.bedquarters.desktopImage"
      :heroImage="data.bedquarters.heroImage"
      />
    <!--<RetailIntro
      :subHeading="data.retail.subHeading2"
      :subHeading2="data.retail.subHeading3"
      :caption="data.retail.caption2"
      :caption2="data.retail.caption3"
      :heroImage="data.retail.image"
      />
    <RetailFeatures
      :features="data.retail.features"
      :subHeading="data.retail.subHeading4"
      :subHeading2="data.retail.subHeading5"
      />
      <RetailPromises
        :subHeading="data.retail.subHeading6"
        :subHeading2="data.retail.subHeading7"
        :promises="data.retail.promises"
        />
      <RetailMap/>
      <RetailQuiz
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
      <RetailJobcard/>-->
    </div>
</template>