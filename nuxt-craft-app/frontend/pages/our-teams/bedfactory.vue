<script setup>
import { usePreview } from '@/composables/usePreview'
import { useGraphQL } from '@/composables/useGraphQL'
import { BEDFACTORY_QUERY } from '@/queries/bedfactory.mjs'
import { useAsyncData } from '#app'

const { isPreview, previewToken, previewTimestamp } = usePreview()
const graphql = useGraphQL()

// Disable SSR for preview mode
if (isPreview.value) {
  definePageMeta({ ssr: false })
}

// Fetch data function
const { data, refresh } = await useAsyncData(
  'bedfactory',
  async () => {
    try {
      const result = await graphql.query(BEDFACTORY_QUERY, {}, {
        previewToken: previewToken.value
      })
      //return result.entry
      //return { bedfactory: result.entry, global: result.globalEntries[0] }
      return JSON.parse(JSON.stringify({
        bedfactory: result.entry,
        global: result.globalEntries[0]
      }));
    } catch (error) {
      console.error('Failed to fetch Bedfactory data:', error)
      throw createError({ 
        statusCode: 404,
        message: 'Bedfactory page not found'
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

// --- SEO & Sharing Meta Tags ---
const homeImage = data.value.bedfactory.sharingImage?.[0]?.url
const globalImage = data.value.global.sharingImage?.[0]?.url

const finalImage = homeImage || globalImage || null

useHead({
  title: data.value.bedfactory.metaTitle || data.value.global.metaTitle,
  meta: [
    {
      name: 'description',
      content: data.value.bedfactory.metaDescription || data.value.global.metaDescription,
    },
    {
      property: 'og:title',
      content: data.value.bedfactory.sharingTitle || data.value.global.sharingTitle,
    },
    {
      property: 'og:url',
      content: data.value.bedfactory.url,
    },
    {
      property: 'og:description',
      content: data.value.bedfactory.sharingDescription || data.value.global.sharingDescription,
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
      content: data.value.bedfactory.url,
    },
    {
      name: 'twitter:title',
      content: data.value.bedfactory.sharingTitle || data.value.global.sharingTitle,
    },
    {
      name: 'twitter:description',
      content: data.value.bedfactory.sharingDescription || data.value.global.sharingDescription,
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
        data.value.bedfactory.defaultRobots !== 'siteDefault'
          ? data.value.bedfactory.defaultRobots
          : data.value.global.defaultRobots,
    },
  ],
})

</script>

<template>
  <div :key="previewTimestamp">
    <BedfactoryHero
      :title="data.bedfactory.title"
      :subHeading="data.bedfactory.subHeading"
      :caption="data.bedfactory.caption"
      :mobileImage="data.bedfactory.mobileImage"
      :desktopImage="data.bedfactory.desktopImage"
      :heroImage="data.bedfactory.heroImage"
      />
    <BedfactoryIntro
      :subHeading="data.bedfactory.subHeading2"
      :subHeading2="data.bedfactory.subHeading3"
      :caption="data.bedfactory.caption2"
      :caption2="data.bedfactory.caption3"
      :heroImage="data.bedfactory.image"
      :list="data.bedfactory.list"
      />
    <BedfactoryFeatures
      :features="data.bedfactory.features"
      :subHeading="data.bedfactory.subHeading4"
      :subHeading2="data.bedfactory.subHeading5"
      />
    <BedfactoryPromises
    :subHeading="data.bedfactory.subHeading6"
    :subHeading2="data.bedfactory.subHeading7"
    :promises="data.bedfactory.promises"
    />
    <BedfactoryMap 
    :subTitle="data.bedfactory.subTitle"
    :copy="data.bedfactory.copy"
    :copy2="data.bedfactory.copy2"
  />
    <!--<BedfactoryQuiz
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