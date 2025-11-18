<script setup>
import { usePreview } from '@/composables/usePreview'
import { useGraphQL } from '@/composables/useGraphQL'
import { HOME_QUERY } from '@/queries/home.mjs'
import { useAsyncData } from '#app'

//Added for image sequnce preloading
// import { onMounted, ref } from 'vue';// Vue composition API
// import { preloadImageSequence } from '@/utils/preloadImageSequence'; // The utility above

// const allCriticalFramesReady = ref(false);

// const sectionsData = [
//   // Define sections needed immediately (e.g., Sections 1 & 2)
//   { count: 75, path: '/images/home/general/dreamscareersite-general' }, 
//   { count: 75, path: '/images/home/bedquarters/dreamscareersite-bedquarters' }
// ];

// // Run setup immediately during component initialization
// (async () => {
//     // Await ONLY the critical frames (e.g., the first 150 frames)
//     const criticalLoads = [
//         preloadImageSequence(sectionsData[0].count, sectionsData[0].path),
//         preloadImageSequence(sectionsData[1].count, sectionsData[1].path)
//     ];
    
//     await Promise.all(criticalLoads);
    
//     allCriticalFramesReady.value = true;
//     console.log("Critical animation frames are now in cache.");
    
//     // Kick off deferred loading for the remaining 4 sections during browser idle time
//     if (window.requestIdleCallback) {
//         window.requestIdleCallback(() => {
//             // Start preloading remaining sections (3, 4, 5, 6) now
//             // ... preloadImageSequence(sectionsData[2].count, sectionsData[2].path);
//         });
//     }

//     // You must manually trigger the global initialization function 
//     // that your main.js code expects.
//     if (window.initAppFeatures) {
//         window.initAppFeatures();
//     }
// })();

// onMounted(() => {
//     // Final check or setup runs here
// });
//End image sequence preloading

const { isPreview, previewToken, previewTimestamp } = usePreview()
const graphql = useGraphQL()

// Disable SSR for preview mode
if (isPreview.value) {
  //definePageMeta({ ssr: false })
  refresh()
}

// Fetch data function
const { data, refresh } = await useAsyncData(
  'home',
  async () => {
    try {
      const result = await graphql.query(HOME_QUERY, {}, {
        previewToken: previewToken.value
      })
      return result.entry
    } catch (error) {
      console.error('Failed to fetch home data:', error)
      throw createError({ 
        statusCode: 404,
        message: 'Homepage not found'
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
  // ,
  // ssr: false
})

const homeData = `<div class="image-sequence-wrapper">
      <div class="image-sequece-wrapper__scroll">Scroll to explore</div>
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
          <h3>${data.value.pageSubheading2}</h3>
          <img 
          class="hidden-desktop" 
          src="/images/home/home-header-1-v1.svg" 
          alt="from our big thinkers."
          />
          <img class="visible-desktop" src="/images/home/home-header-1-desktop-v1.svg" alt="from our big thinkers."/>
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
          <img class="hidden-desktop" src="/images/home/home-header-5-v1.svg" alt="from our big thinkers."/>
          <img class="visible-desktop" src="/images/home/home-header-5-desktop-v1.svg" alt="from our big thinkers."/>
        </div>
      </section>
      <section class="pin-section" id="section-6" data-frame-count="75" data-image-path="images/home/distribution/dreamscareersite-distribution">
        <canvas class="image-sequence-canvas"></canvas>
        <div class="pin-section__title">
          <h3>${data.value.pageSubheading}</h3>
          <img class="hidden-desktop" src="/images/home/home-header-6-v1.svg" alt="helping the nation sleep better."/>
          <img class="visible-desktop" src="/images/home/home-header-6-desktop-v1.svg" alt="helping the nation sleep better."/>
        </div>
      </section>
    </div>
    
    
    <div class="image-sequence-wrapper">
                <div class="image-sequece-wrapper__scroll">Scroll to explore</div>
                <div class="image-sequence-loading">
                    <div class="loader"></div>
                    <img class="image-sequence-loading__logo" src="images/logo.svg" alt="logo Dreams." width="187" height="67">
                </div>

                <section class="pin-section" id="section-1" data-frame-count="75" data-image-path="images/general/dreamscareersite-general">
                    <canvas class="image-sequence-canvas"></canvas>
                    <div class="pin-section__title">
                      <h3>${data.value.pageSubheading2}</h3>
                      <img 
                      class="hidden-desktop" 
                      src="/images/home/home-header-1-v1.svg" 
                      alt="from our big thinkers."
                      />
                      <img class="visible-desktop" src="/images/home/home-header-1-desktop-v1.svg" alt="from our big thinkers."/>
                    </div>
                </section>

                <section class="pin-section" id="section-2" data-frame-count="75" data-image-path="images/bedquarters/dreamscareersite-bedquarters">
                    <canvas class="image-sequence-canvas"></canvas>
                    <div class="pin-section__title">
                      <img class="hidden-desktop" src="/images/home/home-header-2.svg" alt="from our big thinkers."/>
                      <img class="visible-desktop" src="/images/home/home-header-2-desktop.svg" alt="from our big thinkers."/>
                    </div>
                </section>

                <section class="pin-section" id="section-3" data-frame-count="75" data-image-path="images/bedfactory/dreamscareersite-bedfactory">
                    <canvas class="image-sequence-canvas"></canvas>
                    <div class="pin-section__title">
                      <img class="hidden-desktop" src="/images/home/home-header-3.svg" alt="from our big thinkers."/>
                      <img class="visible-desktop" src="/images/home/home-header-3-desktop.svg" alt="from our big thinkers."/>
                    </div>
                </section>

                <section class="pin-section" id="section-4" data-frame-count="87" data-image-path="images/retail/dreamscareersite-retail">
                    <canvas class="image-sequence-canvas"></canvas>
                    <div class="pin-section__title">
                      <img class="hidden-desktop" src="/images/home/home-header-4-v1.svg" alt="from our big thinkers."/>
                      <img class="visible-desktop" src="/images/home/home-header-4-desktop-v1.svg" alt="from our big thinkers."/>
                    </div>
                </section>

                <section class="pin-section" id="section-5" data-frame-count="75" data-image-path="images/distribution/dreamscareersite-distribution">
                    <canvas class="image-sequence-canvas"></canvas>
                    <div class="pin-section__title">
                      <img class="hidden-desktop" src="/images/home/home-header-5-v1.svg" alt="from our big thinkers."/>
                      <img class="visible-desktop" src="/images/home/home-header-5-desktop-v1.svg" alt="from our big thinkers."/>
                    </div>
                </section>

                <section class="pin-section" id="section-6" data-frame-count="75" data-image-path="images/distribution/dreamscareersite-distribution">
                    <canvas class="image-sequence-canvas"></canvas>
                    <div class="pin-section__title">
                      <h3>${data.value.pageSubheading}</h3>
                      <img class="hidden-desktop" src="/images/home/home-header-6-v1.svg" alt="helping the nation sleep better."/>
                      <img class="visible-desktop" src="/images/home/home-header-6-desktop-v1.svg" alt="helping the nation sleep better."/>
                    </div>
                </section>
            </div>
    
    
    
    `

</script>

<template>
<div :key="previewTimestamp">

    <div v-html="homeData"></div>

</div>  
</template>
