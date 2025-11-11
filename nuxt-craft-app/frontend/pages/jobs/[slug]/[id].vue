<script setup>
import { useRoute } from '#app'
import { useGraphQL } from '@/composables/useGraphQL'
import { usePreview } from '@/composables/usePreview'
import { JOB_POSTS_QUERY } from '@/queries/jobPosts.mjs'
import { STORES_QUERY } from '@/queries/stores.mjs'
import { watch, computed } from 'vue'
import { useHead } from '#imports'

const route = useRoute()
const graphql = useGraphQL()
const { isPreview, previewToken, previewTimestamp } = usePreview()
const hero = computed(() => currentPost.value?.image && currentPost.value?.image.length > 0)

// Disable SSR for preview mode
if (isPreview.value) {
  definePageMeta({ ssr: false })
}

const { data, error, refresh } = await useAsyncData(
  `post-${route.params.slug}`,
  async () => {
    try {
      const result = await graphql.query(JOB_POSTS_QUERY, {
        slug: route.params.slug
      }, {
        previewToken: previewToken.value
      })
      
      if (!result?.jobListEntries?.length) {
        throw createError({ 
          statusCode: 404, 
          message: 'Post not found' 
        })
      }
      
      return result
    } catch (err) {
      console.error('Error fetching post:', err)
      throw createError({ 
        statusCode: 404,
        message: 'Post not found'
      })
    }
  },
  {
    watch: [previewToken]
  }
)

// Watch for preview changes
watch([isPreview, previewToken], () => {
  if (isPreview.value && previewToken.value) {
    refresh()
  }
})

const currentPost = computed(() => data.value?.jobListEntries?.[0] || null)
const content = computed(() => data.value?.entry || null)
const hasPost = computed(() => !!currentPost.value)

// Set the page title
useHead(() => ({
  title: currentPost.value?.title || ''
}))

// Fetch store address based on job post postcode
const storeAddress = ref(null)
const storeName = ref(null)


if (currentPost.value?.postCode) {
try {
    const response = await graphql.query(STORES_QUERY, {
      postCode: [currentPost.value.postCode]
    })
    storeAddress.value = response?.storesEntries?.[0]?.fullAddressLine || null
    storeName.value = response?.storesEntries?.[0]?.title || null

  } catch (error) {
    console.error('Store lookup failed:', error)
  }
}

</script>

<template>
  <div :key="previewTimestamp">

    <JobadvertHero
      :title="currentPost.title"
      :heroImage="content.jImages"
      :contractType="currentPost.contractType"
      :contractHours="currentPost.contractHours"
      :sector="currentPost.sector"
      :location="currentPost.location"
      :postCode="currentPost.postCode"
      :salary="currentPost.salary"
      />

<section class="section">
    <div class="container container-sm">
        <article class="card">
            <h4>{{ content.subTitle }}</h4>
            <p v-html="currentPost.jobDescription"></p>
            <h4>{{ content.subTitle2 }}</h4>
            <p v-html="currentPost.person"></p>
            <h4>{{ content.subTitle3 }}</h4>
            <p v-html="currentPost.about"></p>
        </article>
    </div>
</section>
      <JobadvertPromises
        :subHeading="content.subHeading2"
        :subHeading2="content.subHeading3"
        :promises="content.promises"
        />
        <JobadvertMap 
    :subTitle="content.subTitle4"
    :copy="content.caption2"
    :address="storeAddress || currentPost.location"  
    :store="storeName"  
    :postcode="currentPost.postCode"
    />
      <JobadvertFeatures
      :features="content.features"
      :subHeading="content.subHeading4"
      :address="content.subHeading5"
      />


    <!--
    <div v-if="pending" class="container mx-auto py-12 px-2">
      Loading...
    </div>
    
    <div v-else-if="error" class="container mx-auto py-12 px-2 text-red-600">
      {{ error.message }}
    </div>
    
    <template v-else-if="hasPost">
      <header class="container mx-auto pt-12 pb-6 px-2 text-2xl relative" :class="hero ? 'aspect-video' : ''">
        
    

        <div class=" z-10" :class="hero ? 'text-white bg-black/80 p-4 sm:bottom-0 relative sm:ml-4 sm:max-w-screen-lg sm:absolute sm:rounded' : ''">
          <h1 class="font-bold text-4xl sm:text-6xl lg:text-9xl">{{ currentPost.title }}</h1>
          <div class="text-xs mt-4">
            
          </div>
        </div>
      
      </header>

      
    </template>

    <div v-else class="container mx-auto py-12 px-2">
      Post not found
    </div>-->

    
  </div>
</template>