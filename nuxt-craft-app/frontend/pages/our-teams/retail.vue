<script setup>
import { usePreview } from '@/composables/usePreview'
import { useGraphQL } from '@/composables/useGraphQL'
import { RETAIL_QUERY } from '@/queries/retail.mjs'
import { useAsyncData } from '#app'

const { isPreview, previewToken, previewTimestamp } = usePreview()
const graphql = useGraphQL()

// Disable SSR for preview mode
if (isPreview.value) {
  definePageMeta({ ssr: false })
}

// Fetch data function
const { data, refresh } = await useAsyncData(
  'retail',
  async () => {
    try {
      const result = await graphql.query(RETAIL_QUERY, {}, {
        previewToken: previewToken.value
      })
      //return result.entry
      //return { retail: result.entry, global: result.globalEntries[0] }
      return JSON.parse(JSON.stringify({
        retail: result.entry,
        global: result.globalEntries[0],
        jobs: result.jobListEntries
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


// --- Data Transformation for Map ---
// const mapMarkers = computed(() => {
//     // Safely access the jobs array
//     const jobEntries = data.value?.jobs || [];
    
//     // 🎯 Modification: Use the first job entry found to display a single marker.
//     const job = jobEntries[0]; 

//     if (job) {
//         // Access nested coordinates from postcodesCat array
//         const coords = job.postcodesCat?.[0];

//         if (coords && coords.latitude && coords.longitude) {
//             // Return only this single marker object inside an array
//             return [{
//                 id: job.id,
//                 title: job.title,
//                 uri: job.uri, 
//                 location: job.location,
//                 postCode: job.postCode,
//                 position: {
//                     // Convert string coordinates to floating point numbers
//                     lat: parseFloat(coords.latitude), 
//                     lng: parseFloat(coords.longitude),
//                 }
//             }];
//         }
//     }
//     // Returns an empty array if the job list is empty or coordinates are missing.
//     return []; 
// });
// --- CONSOLE LOGS START HERE ---
// console.log('--- Full Data Payload ---', JSON.stringify(data.value, null, 2));
// console.log('FAQs Entry Data:', JSON.stringify(data.value?.retail, null, 2));
// console.log('Global Entry Data:', JSON.stringify(data.value?.global, null, 2));
// console.log('Jobs Data:', JSON.stringify(data.value?.jobs, null, 2));
//console.log('--- Map Markers Data ---', JSON.stringify(mapMarkers.value, null, 2));
// --- CONSOLE LOGS END HERE ---

</script>

<template>
  <div :key="previewTimestamp">
    <RetailHero
      :title="data.retail.title"
      :subHeading="data.retail.subHeading"
      :caption="data.retail.caption"
      :mobileImage="data.retail.mobileImage"
      :desktopImage="data.retail.desktopImage"
      :heroImage="data.retail.heroImage"
      />
    <RetailIntro
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
      <RetailMap 
        :jobs="mapMarkers"
        :subTitle="data.retail.subTitle"
        :copy="data.retail.copy"
        :copy2="data.retail.copy2"
      />
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
      <RetailJobcard/><!--Static now-->
    </div>
</template>