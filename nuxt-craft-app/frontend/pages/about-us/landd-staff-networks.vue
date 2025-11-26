<script setup>
import { usePreview } from '@/composables/usePreview'
import { useGraphQL } from '@/composables/useGraphQL'
import { STAFF_QUERY } from '@/queries/staff.mjs'
import { useAsyncData } from '#app'

const { isPreview, previewToken, previewTimestamp } = usePreview()
const graphql = useGraphQL()

// Disable SSR for preview mode
if (isPreview.value) {
  definePageMeta({ ssr: false })
}

// Fetch data function
const { data, refresh } = await useAsyncData(
  'staff',
  async () => {
    try {
      const result = await graphql.query(STAFF_QUERY, {}, {
        previewToken: previewToken.value
      })
      //return result.entry
      //return { staff: result.entry, global: result.globalEntries[0] }
      return JSON.parse(JSON.stringify({
        staff: result.entry,
        global: result.globalEntries[0]
      }));
    } catch (error) {
      console.error('Failed to fetch AboutUs-Staff data:', error)
      throw createError({ 
        statusCode: 404,
        message: 'AboutUs-Staff page not found'
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

// --- SEO & Sharing Meta Tags ---
const homeImage = data.value.staff.sharingImage?.[0]?.url
const globalImage = data.value.global.sharingImage?.[0]?.url

const finalImage = homeImage || globalImage || null

useHead({
  title: data.value.staff.metaTitle || data.value.global.metaTitle,
  meta: [
    {
      name: 'description',
      content: data.value.staff.metaDescription || data.value.global.metaDescription,
    },
    {
      property: 'og:title',
      content: data.value.staff.sharingTitle || data.value.global.sharingTitle,
    },
    {
      property: 'og:url',
      content: data.value.staff.url,
    },
    {
      property: 'og:description',
      content: data.value.staff.sharingDescription || data.value.global.sharingDescription,
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
      content: data.value.staff.url,
    },
    {
      name: 'twitter:title',
      content: data.value.staff.sharingTitle || data.value.global.sharingTitle,
    },
    {
      name: 'twitter:description',
      content: data.value.staff.sharingDescription || data.value.global.sharingDescription,
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
        data.value.staff.defaultRobots !== 'siteDefault'
          ? data.value.staff.defaultRobots
          : data.value.global.defaultRobots,
    },
  ],
})

</script>

<template>
  <div :key="previewTimestamp">
    <StaffHero
      :title="data.staff.title"
      :caption="data.staff.caption"
      :mobileImage="data.staff.mobileImage"
      :desktopImage="data.staff.desktopImage"
      :heroImage="data.staff.heroImage"
      />
    <StaffIntro
      :subHeading="data.staff.subHeading"
      :copy="data.staff.copy"
      :image="data.staff.image"
      />
    <StaffHistory
       :history="data.staff.history"
    />
    <StaffNetwork
       :images="data.staff.images"
       :images2="data.staff.images2"
       :subTitle="data.staff.subTitle"
       :copy="data.staff.copy2"
       :copy2="data.staff.copy3"
       :copy3="data.staff.copy4"
       :list="data.staff.list"
    />
    </div>
</template>