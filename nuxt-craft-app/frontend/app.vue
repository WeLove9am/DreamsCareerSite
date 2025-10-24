<script setup>
import { useGraphQL } from '~/composables/useGraphQL'
import { GLOBALS_QUERY } from '~/queries/globals.mjs'

const graphql = useGraphQL()

// Fetch globals data
const { data: globalsData } = await useAsyncData('globals', async () => {
  try {
    const result = await graphql.query(GLOBALS_QUERY)

    return {
      global: result?.globalEntries?.[0] || {},
      pages: result?.pagesEntries || [],
      headernav: result?.headerEntries || []
    }
  } catch (err) {
    console.error('Error fetching globals:', err)
    throw err
  }
})

// Provide to all child components
provide('globalsData', globalsData)
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
