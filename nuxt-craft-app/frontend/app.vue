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
