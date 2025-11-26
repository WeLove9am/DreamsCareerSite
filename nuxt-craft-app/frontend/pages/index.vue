<script setup>
import { usePreview } from '@/composables/usePreview'
import { useGraphQL } from '@/composables/useGraphQL'
import { HOME_QUERY } from '@/queries/home.mjs'
import { useAsyncData } from '#app'

const { isPreview, previewToken, previewTimestamp } = usePreview()
const graphql = useGraphQL()

// Disable SSR for preview mode
// if (isPreview.value) {
//   //definePageMeta({ ssr: false })
//   refresh()
// }

// Fetch data function

const { data, refresh } = await useAsyncData(
  'home',
  async () => {
    try {
      const result = await graphql.query(HOME_QUERY, {}, {
        previewToken: previewToken.value
      })
      return JSON.parse(JSON.stringify({
        home: result.entry,
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
// Use a custom layout for the homepage 
definePageMeta({
  layout: 'home',
  ssr: false
})

// --- SEO & Sharing Meta Tags ---
const homeImage = data.value.home.sharingImage?.[0]?.url
const globalImage = data.value.global.sharingImage?.[0]?.url

const finalImage = homeImage || globalImage || null

useHead({
  title: data.value.home.metaTitle || data.value.global.metaTitle,
  meta: [
    {
      name: 'description',
      content: data.value.home.metaDescription || data.value.global.metaDescription,
    },
    {
      property: 'og:title',
      content: data.value.home.sharingTitle || data.value.global.sharingTitle,
    },
    {
      property: 'og:url',
      content: data.value.home.url,
    },
    {
      property: 'og:description',
      content: data.value.home.sharingDescription || data.value.global.sharingDescription,
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
      content: data.value.home.url,
    },
    {
      name: 'twitter:title',
      content: data.value.home.sharingTitle || data.value.global.sharingTitle,
    },
    {
      name: 'twitter:description',
      content: data.value.home.sharingDescription || data.value.global.sharingDescription,
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
        data.value.home.defaultRobots !== 'siteDefault'
          ? data.value.home.defaultRobots
          : data.value.global.defaultRobots,
    },
  ],
})

const homeData = `<div class="image-sequece-wrapper__scroll">Scroll to explore</div>
      <div class="image-sequence-loading">
        <div class="loader"></div>
        <img 
          class="image-sequence-loading__logo" 
          src="/images/home/logo.svg" 
          alt="logo Dreams." 
          width="187" 
          height="67"
        />
      </div>
      <section class="pin-section" id="section-1" data-frame-count="75" data-image-path="images/home/general/dreamscareersite-general">
        <canvas class="image-sequence-canvas"></canvas>
        <div class="pin-section__title">
          <h3>${data.value.home.pageSubheading2}</h3>
          <img 
          class="hidden-desktop" 
          src="/images/home/home-header-1-v2.svg" 
          alt="from our big thinkers."
          />
          <img class="visible-desktop" src="/images/home/home-header-1-desktop-v2.svg" alt="from our big thinkers."/>
        </div>
      </section>
      <section class="pin-section" id="section-2" data-frame-count="75" data-image-path="images/home/bedquarters/dreamscareersite-bedquarters">
        <canvas class="image-sequence-canvas"></canvas>
        <div class="pin-section__title">
          <img class="hidden-desktop" src="/images/home/home-header-2.svg" alt="from our big thinkers."/>
          <img class="visible-desktop" src="/images/home/home-header-2-desktop.svg" alt="from our big thinkers."/>
        </div>
      </section>
      <section class="pin-section" id="section-3" data-frame-count="75" data-image-path="images/home/bedfactory/dreamscareersite-bedfactory">
        <canvas class="image-sequence-canvas"></canvas>
        <div class="pin-section__title">
          <img class="hidden-desktop" src="/images/home/home-header-3.svg" alt="from our big thinkers."/>
          <img class="visible-desktop" src="/images/home/home-header-3-desktop.svg" alt="from our big thinkers."/>
        </div>
      </section>
      <section class="pin-section" id="section-4" data-frame-count="87" data-image-path="images/home/retail/dreamscareersite-retail">
        <canvas class="image-sequence-canvas"></canvas>
        <div class="pin-section__title">
          <img class="hidden-desktop" src="/images/home/home-header-4-v1.svg" alt="from our big thinkers."/>
          <img class="visible-desktop" src="/images/home/home-header-4-desktop-v1.svg" alt="from our big thinkers."/>
        </div>
      </section>
      <section class="pin-section" id="section-5" data-frame-count="75" data-image-path="images/home/distribution/dreamscareersite-distribution">
        <canvas class="image-sequence-canvas"></canvas>
        <div class="pin-section__title">
          <img class="hidden-desktop" src="/images/home/home-header-5-v2.svg" alt="from our big thinkers."/>
          <img class="visible-desktop" src="/images/home/home-header-5-desktop-v2.svg" alt="from our big thinkers."/>
        </div>
      </section>
      <section class="pin-section" id="section-6" data-frame-count="75" data-image-path="images/home/distribution/dreamscareersite-distribution">
        <canvas class="image-sequence-canvas"></canvas>
        <div class="pin-section__title">
          <h3>${data.value.home.pageSubheading}</h3>
          <img class="hidden-desktop" src="/images/home/home-header-6-v1.svg" alt="helping the nation sleep better."/>
          <img class="visible-desktop" src="/images/home/home-header-6-desktop-v1.svg" alt="helping the nation sleep better."/>
        </div>
      </section>`

</script>

<template>
    <div class="image-sequence-wrapper" v-html="homeData"></div>
</template>
