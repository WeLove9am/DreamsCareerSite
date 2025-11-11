<script setup>
import { ref, watch, computed, nextTick } from 'vue'
import { useHead } from '#imports'
import { usePaginatedData } from '@/composables/usePaginatedData'
import { useGraphQL } from '@/composables/useGraphQL'
import { usePreview } from '@/composables/usePreview'
import { JOB_POSTS_QUERY } from '@/queries/jobs.mjs'
//import Joblist from '../components/joblist.vue'

const graphql = useGraphQL()
const { isPreview, previewToken, previewTimestamp } = usePreview()

// ADD THESE (make sure they're declared before use)
const search = ref('')          // for keyword (title + description)
const location = ref('')        // for location/postcode
const selectedSectors = ref([]) // optional filters
const selectedContracts = ref([])
const distance = ref(0)         // optional, if you still use it


if (isPreview.value) {
  //definePageMeta({ ssr: false })
  refresh()
}

const fetchBlogData = async (page, perPage) => {
  try {
    const result = await graphql.query(JOB_POSTS_QUERY, {
      // limit: perPage,
      // offset: (page - 1) * perPage
      limit: 9999,
      offset: 0
    }, {
      previewToken: previewToken.value
    })
    
    return {
      content: result?.entry || {},
      posts: result?.jobListEntries || [],
      total: result?.entryCount || 0
    }
  } catch (error) {
    throw error
  }
}

const {
  currentPage,
  data,
  totalPages,
  loading,
  error,
  updateCurrentPage,
  fetchPageData
} = usePaginatedData(fetchBlogData)

watch([isPreview, previewToken], () => {
  if (isPreview.value && previewToken.value) {
    fetchPageData(currentPage.value)
  }
})

const itemsPerPage = 10 // or whatever you prefer

// Filtered job list
const filteredJobs = computed(() => {
  let jobs = data.value?.posts || []

  // Keyword filter
  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    jobs = jobs.filter(
      (job) =>
        job.title?.toLowerCase().includes(q) ||
        job.jobDescription?.toLowerCase().includes(q)
    )
  }

  // Location filter
  if (location.value.trim()) {
    const loc = location.value.toLowerCase()
    jobs = jobs.filter(
      (job) =>
        job.location?.toLowerCase().includes(loc) ||
        job.postCode?.toLowerCase().includes(loc)
    )
  }


  // Sector filter
  if (selectedSectors.value.length) {
    jobs = jobs.filter(job =>
      job.sector?.some(s => selectedSectors.value.includes(s.title))
    )
  }

  // Contract type filter
  if (selectedContracts.value.length) {
    jobs = jobs.filter(job =>
      job.contractType?.some(c => selectedContracts.value.includes(c.title))
    )
  }

  return jobs
})

// ✅ Total pages based on filtered results
const filteredTotalPages = computed(() =>
  Math.ceil(filteredJobs.value.length / itemsPerPage)
)

// ✅ Slice for current page
const paginatedJobs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredJobs.value.slice(start, end)
})

// ✅ Reset to first page when filters change
watch([search, location], () => {
  currentPage.value = 1
})

const allSectors = computed(() => {
  const jobs = data.value?.posts || []
  const sectors = new Set()

  jobs.forEach(job => {
    job.sector?.forEach(s => {
      if (s?.title) sectors.add(s.title)
    })
  })

  return Array.from(sectors).sort()
})

const allContractTypes = computed(() => {
  const jobs = data.value?.posts || []
  const contracts = new Set()

  jobs.forEach(job => {
    job.contractType?.forEach(c => {
      if (c?.title) contracts.add(c.title)
    })
  })

  return Array.from(contracts).sort()
})


const content = computed(() => data.value?.content || {})


// Set the page title
useHead(() => ({
  title: content.value?.title || ''
}))



// truncates the string.
const truncate = (text, maxLength) => {
    if (!text) return '';
        return text.slice(0, maxLength) + '...';
};

// This function only runs in the browser
function openApply(link, target='_self') {
  if (typeof window !== 'undefined' && link) {
    window.open(link, target)
  }
}

// Handle search from Hero component
const handleHeroSearch = ({ keyword, location: loc }) => {
  search.value = keyword
  location.value = loc   // now refers to your ref correctly
  fetchPageData(1)
}

nextTick(() => {
  const firstJob = document.querySelector('.job-list')
  if (firstJob) {
    firstJob.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
})
// Reset to first page when filters change
watch([search, location, selectedSectors, selectedContracts], () => {
  updateCurrentPage(1)
})

// Debugging logs
//console.log('--- Posts Data ---', JSON.stringify(posts.value, null, 2));
//console.log('--- Content Data (Header/Container) ---', JSON.stringify(content.value, null, 2));
// console.log('Current Page:', currentPage.value)
// console.log('Total Pages:', totalPages.value)

watchEffect(() => {
  console.log('Debug →', {
    jobsFetched: data.value?.posts?.length,
    filteredJobs: filteredJobs.value.length,
    totalPagesFromServer: totalPages.value,
    totalPagesFiltered: filteredTotalPages.value,
    currentPage: currentPage.value
  })
})

</script>

<template>
  <div :key="previewTimestamp">
    <JobsHero
      :title="data.content.title"
      :subHeading="data.content.subHeading"
      :caption="data.content.caption"
      :mobileImage="data.content.mobileImage"
      :desktopImage="data.content.desktopImage"
      :heroImage="data.content.heroImage"
      v-model="search"
      @search="handleHeroSearch"
  />
    
       
      

              <section class="jobs">
                <div class="container">
                    <div class="job-form">
                        <form action="#" method="post">
                            <div class="job-form__item">
                              <h3>Job Sector</h3>
                              <div class="job-form__inputs">
                                <template v-for="sector in allSectors" :key="sector">
                                  <label class="checkbox button">
                                    <input
                                      class="checkbox-input"
                                      type="checkbox"
                                      :value="sector"
                                      v-model="selectedSectors"
                                    />
                                    <span class="checkbox-box__label">{{ sector }}</span>
                                  </label>
                                </template>
                              </div>
                            </div>

                            <div class="job-form__item">
                              <h3>Contract Type</h3>
                              <div class="job-form__inputs">
                                <template v-for="type in allContractTypes" :key="type">
                                  <label class="checkbox button">
                                    <input
                                      class="checkbox-input"
                                      type="checkbox"
                                      :value="type"
                                      v-model="selectedContracts"
                                    />
                                    <span class="checkbox-box__label">{{ type }}</span>
                                  </label>
                                </template>
                              </div>
                            </div>

                            <div class="job-form__item">
                                <h3>Distance </h3>
                                <div class="job-form__inputs job-form__inputs--col">
                                    <select class="select" name="distance">
                                        <option value="10">Within 10 miles</option>
                                        <option value="20">Within 20 miles</option>
                                        <option value="30">Within 30 miles</option>
                                        <option value="40">Within 40 miles</option>
                                        <option value="50">Within 50 miles</option>
                                    </select>
                                    <button class="button button--primary text-uppercase" type="submit">Update</button>
                                </div>
                            </div>
                        </form>
                    </div>
                          <div class="job-list">

                          <template v-if="loading">
                            <div class="loading-container">
                              <span class="spinner"></span>
                              <span class="loading-text">Loading jobs...</span>
                            </div>
                          </template>
                          <template v-else-if="error">
                            <div>Error: {{ error.message }}</div>
                          </template>
                          <template v-else>


                            <template v-if="paginatedJobs.length">
                                  <div class="job-item" v-for="entry in paginatedJobs" :key="entry.id">
                                    <div class="job-item__info">
                                        <h3>{{ entry.title }}</h3>
                                        <p v-html="truncate(entry.jobDescription,300)"></p>
                                        <div class="job-item__wrapper">
                                            <div class="job-item__title">
                                                <ul>
                                                    <li>Contract type:</li>
                                                    <li>Contract hours: </li>
                                                    <li>Location:</li>
                                                    <li>Salary:</li>
                                                </ul>
                                            </div>
                                            <div class="job-item__info">
                                                <ul>
                                                    <li>{{ entry.contractType[0]?.title || 'N/A' }}</li>
                                                    <li>{{ entry.contractHours[0]?.title || 'N/A' }}</li>
                                                    <li>{{ entry.location || 'N/A' }}, {{ entry.postCode || 'N/A' }}</li>
                                                    <li>{{ entry.salary || 'N/A' }}</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="job-item__buttons">
                                        <button
                                          v-if="entry.jobLink"
                                          class="button button--primary text-uppercase"
                                          @click="openApply(entry.jobLink, '_blank')"
                                        >
                                          Apply
                                        </button>

                                          <button
                                            class="button text-uppercase"
                                            @click="openApply(`/jobs/${entry.slug}`, '_blank')"
                                          >
                                            Read more
                                          </button>
                                    </div>
                                </div>
                              </template>
                              <template v-else>
                                <div class="job-item">
                                    <div class="job-item__info">
                                        <div class="job-item__wrapper">
                                            <div class="job-item__title">
                                                <ul>
                                                    <li>No jobs found. Please try a different search or filter.</li>
                                                </ul>
                                            </div>
                                         </div>   
                                    </div>
                                </div>
                              </template>

                              

                            </template>
                              
                          </div>
                </div>
                <div class="container">
                    <div class="jobs__pagination">
                        <Jobspagination
                          v-if="filteredTotalPages > 1"
                          :currentPage="currentPage"
                          :totalPages="filteredTotalPages"
                          @update:currentPage="updateCurrentPage"
                        />


                    </div>
                    
                </div>
            </section>

    </div>
</template>
