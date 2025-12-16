<script setup>
import { usePreview } from '@/composables/usePreview'
import { useGraphQL } from '@/composables/useGraphQL'
import { HOME_QUERY } from '@/queries/home.mjs'
import { useAsyncData } from '#app'
import { inject, watch } from 'vue'


const { isPreview, previewToken, previewTimestamp } = usePreview()
const graphql = useGraphQL()
const globalsData = inject('globalsData')
const footerData = inject('footerData')
const footer2Data = inject('footer2Data')

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
  layout: 'home'
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

</script>

<template>
  <div>
    <Headerhome
      :globalData="globalsData?.global"
      :pages="globalsData?.pages"
      :headernav="globalsData?.headernav"
    />
    <Alert />
    <main class="main">
      <div class="error-page">
        <section class="section error-hero">
          <div class="container">
            <p class="eyebrow">Oops! Something went wrong</p>
            <h1>Sorry, we can’t find that page</h1>
            <p>
              The link you followed may be broken or the page may have been removed.
              Let’s get you back on track with your Dreams career journey.
            </p>
            <div class="error-hero__cta">
              <NuxtLink class="button button--primary" to="/">
                Back to homepage
              </NuxtLink>
              <NuxtLink class="button button--ghost" to="/how-to-apply/faqs">
                Visit our FAQs
              </NuxtLink>
            </div>
          </div>
        </section>

        <section class="section error-help">
          <div class="container">
            <div class="error-help__cards">
              <article class="card">
                <h3>Browse open roles</h3>
                <p>Explore roles across Retail, Bedquarters, Distribution, and the Bed Factory.</p>
                <NuxtLink class="button button--primary" to="/jobs">
                  View our jobs
                </NuxtLink>
              </article>
              <article class="card">
                <h3>Talk to our team</h3>
                <p>Need support or have a question about an application? We’re here to help.</p>
                <NuxtLink
                  class="button button--ghost"
                  :to="{ path: '/', hash: '#contact' }"
                >
                  Contact us
                </NuxtLink>
              </article>
            </div>
          </div>
        </section>
      </div>
    </main>
    <Footer
      :globalData="globalsData?.global"
      :footerData="footerData"
      :footer2Data="footer2Data"
    />
  </div>
</template>
