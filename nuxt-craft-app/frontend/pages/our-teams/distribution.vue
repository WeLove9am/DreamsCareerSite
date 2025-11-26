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
        global: result.globalEntries[0],
        jobs: result.jobListEntries
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
                    slug: job.slug,
                    jobId: job.jobId,
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

// --- SEO & Sharing Meta Tags ---
const homeImage = data.value.distribution.sharingImage?.[0]?.url
const globalImage = data.value.global.sharingImage?.[0]?.url

const finalImage = homeImage || globalImage || null

useHead({
  title: data.value.distribution.metaTitle || data.value.global.metaTitle,
  meta: [
    {
      name: 'description',
      content: data.value.distribution.metaDescription || data.value.global.metaDescription,
    },
    {
      property: 'og:title',
      content: data.value.distribution.sharingTitle || data.value.global.sharingTitle,
    },
    {
      property: 'og:url',
      content: data.value.distribution.url,
    },
    {
      property: 'og:description',
      content: data.value.distribution.sharingDescription || data.value.global.sharingDescription,
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
      content: data.value.distribution.url,
    },
    {
      name: 'twitter:title',
      content: data.value.distribution.sharingTitle || data.value.global.sharingTitle,
    },
    {
      name: 'twitter:description',
      content: data.value.distribution.sharingDescription || data.value.global.sharingDescription,
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
        data.value.distribution.defaultRobots !== 'siteDefault'
          ? data.value.distribution.defaultRobots
          : data.value.global.defaultRobots,
    },
  ],
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
    <DistributionMap 
        :jobs="mapMarkers"
        :subTitle="data.distribution.subTitle"
        :copy="data.distribution.copy"
        :copy2="data.distribution.copy2"
      />
    <!--<DistributionQuiz
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