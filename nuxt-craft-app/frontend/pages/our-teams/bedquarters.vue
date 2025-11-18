<script setup>
import { usePreview } from '@/composables/usePreview'
import { useGraphQL } from '@/composables/useGraphQL'
import { BEDQUARTERS_QUERY } from '@/queries/bedquarters.mjs'
import { useAsyncData } from '#app'

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
        global: result.globalEntries[0],
        jobs: result.jobListEntries
      }));
    } catch (error) {
      console.error('Failed to fetch Bedquarters data:', error)
      throw createError({ 
        statusCode: 404,
        message: 'Bedquarters page not found'
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

// --- 1. Map Data Transformation ---
const mapMarkers = computed(() => {
    // Access data.value?.jobs, which contains the jobListEntries array
    const jobEntries = data.value?.jobs || [];
    
    return jobEntries
        .map(job => {
            const coords = job.postcodesCat?.[0];

            // Ensure coordinates exist and are valid numbers
            if (coords && coords.latitude && coords.longitude) {
                return {
                    id: job.id,
                    title: job.title,
                    uri: job.uri,
                    locationName: job.location,
                    postCode: job.postCode,
                    postcodesCat: [{
                        longitude: parseFloat(coords.longitude),
                        latitude: parseFloat(coords.latitude)
                    }]
                };
            }
            return null; // Skip invalid jobs
        })
        .filter(job => job !== null);
});
//console.log('Global Data:', JSON.stringify(data.value?.global, null, 2))
//console.log('bedquarters Page Data:', JSON.stringify(data.value, null, 2))
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
    <BedquartersIntro
      :subHeading="data.bedquarters.subHeading2"
      :subHeading2="data.bedquarters.subHeading3"
      :caption="data.bedquarters.caption2"
      :list="data.bedquarters.list"
      :heroImage="data.bedquarters.image"
      />
    <BedquartersFeatures
      :features="data.bedquarters.features"
      :subHeading="data.bedquarters.subHeading4"
    />
    <BedquartersPromises
      :subHeading="data.bedquarters.subHeading6"
      :subHeading2="data.bedquarters.subHeading7"
      :promises="data.bedquarters.promises"
      />
      <BedquartersMap 
        :jobs="mapMarkers"
        :subTitle="data.bedquarters.subTitle"
        :copy="data.bedquarters.copy"
        :copy2="data.bedquarters.copy2"
      />
      <!--<BedquartersQuiz
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
        />-->
    </div>
</template>