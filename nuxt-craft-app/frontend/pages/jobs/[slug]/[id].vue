<script setup>
import { useRoute, useRequestURL } from '#app'
import { useGraphQL } from '@/composables/useGraphQL'
import { usePreview } from '@/composables/usePreview'
import { JOB_POSTS_QUERY } from '@/queries/jobPosts.mjs'
import { STORES_QUERY } from '@/queries/stores.mjs'
import { watch, computed } from 'vue'
import { useHead } from '#imports'

const route = useRoute()
const graphql = useGraphQL()
const url = useRequestURL()
const fullUrl = url.href        // full URL
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
const global = computed(() => data.value?.globalEntries?.[0] || null)
const retail = computed(() => data.value?.retail || null)
const bedquarters = computed(() => data.value?.bedquarters || null)
const distribution = computed(() => data.value?.distribution || null)
const bedfactory = computed(() => data.value?.bedfactory || null)


// --- SEO & Sharing Meta Tags ---
const jobTitle = currentPost.value?.title || ''
const locationName = currentPost.value?.location || ''
const postCode = currentPost.value?.postCode || ''
const globalImage = global.value?.sharingImage?.[0]?.url || ''
// Build “Location, Postcode” safely
const fullLocation = locationName
  ? postCode
    ? `${locationName}, ${postCode}`
    : locationName
  : postCode
    ? postCode
    : ''

useHead({
  title: `Dreams Careers${jobTitle ? ' | ' + jobTitle : ''}${fullLocation ? ' Job in ' + fullLocation : ''}`,
  meta: [
    {
      name: 'description',
      content: `Apply for the ${jobTitle ? jobTitle : ''} role at Dreams in ${fullLocation ? ' Job in ' + fullLocation : ''}. Explore responsibilities, benefits and growth opportunities. Start your application today.`,
    },
    {
      property: 'og:title',
      content: `Dreams Careers${jobTitle ? ' | ' + jobTitle : ''}${fullLocation ? ' Job in ' + fullLocation : ''}`,
    },
    {
      property: 'og:url',
      content: fullUrl,
    },
    {
      property: 'og:description',
      content: `Apply for the ${jobTitle ? jobTitle : ''} role at Dreams in ${fullLocation ? ' Job in ' + fullLocation : ''}. Explore responsibilities, benefits and growth opportunities. Start your application today.`,
    },
    {
      property: 'og:image',
      content: globalImage || '',
    },
    {
      name: 'twitter:card',
      content: 'summary_large_image',
    },
    {
      name: 'twitter:site',
      content: fullUrl,
    },
    {
      name: 'twitter:title',
      content: `Dreams Careers${jobTitle ? ' | ' + jobTitle : ''}${fullLocation ? ' Job in ' + fullLocation : ''}`,
    },
    {
      name: 'twitter:description',
      content: `Apply for the ${jobTitle ? jobTitle : ''} role at Dreams in ${fullLocation ? ' Job in ' + fullLocation : ''}. Explore responsibilities, benefits and growth opportunities. Start your application today.`,
    },
    {
      name: 'twitter:image',
      content: globalImage || '',
    },
    {
      name: 'robots',
      content: global.value?.defaultRobots || '',
    },
  ]
  })


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

function nl2brList(text) {
  if (!text) return ''

  const lines = text.split('\n')
  let html = ''
  let inList = false

  lines.forEach(line => {
    const trimmed = line.trim()

    // Detect list item: "- something"
    if (/^- /.test(trimmed) || trimmed === '-') {
      if (!inList) {
        html += '<ul>'
        inList = true
      }
      // Remove the dash and space, wrap in <li>
      html += `<li>${trimmed.replace(/^-\s?/, '')}</li>`
    } else {
      // Close list if previously open
      if (inList) {
        html += '</ul>'
        inList = false
      }
      html += trimmed + '<br/>'
    }
  })

  // Close list if file ended during list
  if (inList) html += '</ul>'

  return html
}


definePageMeta({
  layout: 'application'
})
const globalsData = inject('globalsData')



// Sector-based content selection
const selectedSectorId = computed(() => Number(currentPost.value?.sector?.[0]?.id))
// PROMISES
const selectedPromises = computed(() => {
  if (selectedSectorId.value === 392) {
    return retail.value?.promises
  }
  if (selectedSectorId.value === 424) {
    return distribution.value?.promises
  }
  if (selectedSectorId.value === 443) {
    return bedquarters.value?.promises
  }
  if (selectedSectorId.value === 485) {
    return bedfactory.value?.promises
  }
  return content.value?.promises
})

// FEATURES
const selectedFeatures = computed(() => {
  if (selectedSectorId.value === 392) {
    return retail.value?.features
  }
  if (selectedSectorId.value === 424) {
    return distribution.value?.features
  }
  if (selectedSectorId.value === 443) {
    return bedquarters.value?.features
  }
  if (selectedSectorId.value === 485) {
    return bedfactory.value?.features
  }
  return content.value?.features
})

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
            <div v-html="nl2brList(currentPost.jobDescription)"></div>
            <h4>{{ content.subTitle2 }}</h4>
            <div v-html="nl2brList(currentPost.person)"></div>
            <h4>{{ content.subTitle3 }}</h4>
            <div v-html="nl2brList(currentPost.about)"></div>
        </article>
    </div>
</section>
      <JobadvertPromises
        :subHeading="content.subHeading2"
        :subHeading2="content.subHeading3"
        :promises="selectedPromises"
        />
        <JobadvertMap 
    :subTitle="content.subTitle4"
    :copy="content.caption2"
    :address="storeAddress || currentPost.location"  
    :store="storeName"  
    :postcode="currentPost.postCode"
    />
      <JobadvertFeatures
      :features="selectedFeatures"
      :subHeading="content.subHeading4"
      :address="content.subHeading5"
      />

      <JobadvertFooter :globalData="globalsData?.global"
      :title="currentPost.title"
      :contractType="currentPost.contractType"
      :contractHours="currentPost.contractHours"
      :sector="currentPost.sector"
      :location="currentPost.location"
      :postCode="currentPost.postCode"
      :salary="currentPost.salary"
      :jobDescription="currentPost.jobDescription"
      :jobLink="currentPost.jobLink"
      />
  </div>
</template>