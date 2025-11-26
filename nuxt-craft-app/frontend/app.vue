<script setup>
import { useGraphQL } from '~/composables/useGraphQL'
import { GLOBALS_QUERY } from '~/queries/globals.mjs'
import { FOOTER_QUERY } from '~/queries/footer.mjs'
import { FOOTER2_QUERY } from '~/queries/footer2.mjs'

const graphql = useGraphQL()

// Load ALL layout data in one async request
const { data: layoutData } = await useAsyncData(
  'layout-data',
  async () => {
    try {
      const [globalsResult, footerResult, footer2Result] = await Promise.all([
        graphql.query(GLOBALS_QUERY),
        graphql.query(FOOTER_QUERY),
        graphql.query(FOOTER2_QUERY),
      ])

      return {
        globals: {
          global: globalsResult?.globalEntries?.[0] || {},
          pages: globalsResult?.pagesEntries || [],
          headernav: globalsResult?.headerEntries || []
        },
        footer: footerResult?.entries || {},
        footer2: footer2Result?.entries || {}
      }
    } catch (err) {
      console.error('Error fetching layout queries:', err)
      throw err
    }
  }
)

// Google Tag Manager Integration
const gtmId = layoutData.value.globals?.global?.gtmId

if (gtmId) {
  useHead({
    script: [
      {
        children: `
          (function(w,d,s,l,i){
            w[l]=w[l]||[];
            w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
            var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s), dl=l!='dataLayer'?'&l='+l:'';
            j.async=true;
            j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
            f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${gtmId}');
        `
      }
    ],
    // Injecting the <noscript> tag into the <body> element
    noscript: [
        {
            innerHTML: `<iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
            tagPosition: 'bodyOpen' // Ensures it is placed right after <body>
        }
    ],
  })
}

// Provide to ALL components globally
provide('globalsData', layoutData.value.globals)
provide('footerData', layoutData.value.footer)
provide('footer2Data', layoutData.value.footer2)

// console.log('Footer 1:', layoutData.value.footer)
// console.log('Footer 2:', layoutData.value.footer2)
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
