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
const distance = ref(0)         // optional, if you still use it

if (isPreview.value) {
  //definePageMeta({ ssr: false })
  refresh()
}

const fetchBlogData = async (page, perPage) => {
  try {
    const result = await graphql.query(JOB_POSTS_QUERY, {
      limit: perPage,
      offset: (page - 1) * perPage
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

const posts = computed(() => {
  let jobs = data.value?.posts || []

  // Keyword search (title + description)
  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    jobs = jobs.filter(
      (job) =>
        job.title?.toLowerCase().includes(q) ||
        job.jobDescription?.toLowerCase().includes(q)
    )
  }

  // Location filter (location + postcode)
  if (location.value.trim()) {
    const loc = location.value.toLowerCase()
    jobs = jobs.filter(
      (job) =>
        job.location?.toLowerCase().includes(loc) ||
        job.postCode?.toLowerCase().includes(loc)
    )
  }

  return jobs
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

// Debugging logs
//console.log('--- Posts Data ---', JSON.stringify(posts.value, null, 2));
//console.log('--- Content Data (Header/Container) ---', JSON.stringify(content.value, null, 2));
console.log('Current Page:', currentPage.value)
console.log('Total Pages:', totalPages.value)
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
      @search="handleHeroSearch"
      />
    
       
      

              <section class="jobs">
                <div class="container">
                    <div class="job-form">
                        <form action="#" method="post">
                            <div class="job-form__item">
                                <h3>Job Sector</h3>
                                <div class="job-form__inputs">
                                    <label class="checkbox button">
                                        <input class="checkbox-input" type="checkbox" name="checkbox" checked="checked" /><span class="checkbox-box__label">Retail</span>
                                    </label>
                                    <label class="checkbox button">
                                        <input class="checkbox-input" type="checkbox" name="checkbox" /><span class="checkbox-box__label">Bedquarters</span>
                                    </label>
                                    <label class="checkbox button">
                                        <input class="checkbox-input" type="checkbox" name="checkbox" /><span class="checkbox-box__label">Bed Factory</span>
                                    </label>
                                    <label class="checkbox button">
                                        <input class="checkbox-input" type="checkbox" name="checkbox" /><span class="checkbox-box__label">Distribution</span>
                                    </label>
                                </div>
                            </div>
                            <div class="job-form__item">
                                <h3>Contract Type</h3>
                                <div class="job-form__inputs">
                                    <label class="checkbox button">
                                        <input class="checkbox-input" type="checkbox" name="checkbox" checked="checked" /><span class="checkbox-box__label">Permanent</span>
                                    </label>
                                    <label class="checkbox button">
                                        <input class="checkbox-input" type="checkbox" name="checkbox" /><span class="checkbox-box__label">Part-time</span>
                                    </label>
                                    <label class="checkbox button">
                                        <input class="checkbox-input" type="checkbox" name="checkbox" /><span class="checkbox-box__label">Seasonal</span>
                                    </label>
                                    <label class="checkbox button">
                                        <input class="checkbox-input" type="checkbox" name="checkbox" /><span class="checkbox-box__label">Fixed Contract</span>
                                    </label>
                                </div>
                            </div>
                            <div class="job-form__item">
                                <h3>Location </h3>
                                <div class="job-form__inputs job-form__inputs--col">
                                    <select class="select" name="distance1">
                                        <option value="10">Within 10 miles</option>
                                        <option value="20">Within 20 miles</option>
                                        <option value="30">Within 30 miles</option>
                                        <option value="40">Within 40 miles</option>
                                        <option value="50">Within 50 miles</option>
                                    </select>
                                    <input class="input" type="text" placeholder="Location or postcode" name="location">
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


                            <template v-if="posts.length">
                              <div class="job-item" v-for="entry in posts" :key="entry.id">
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
                          v-if="totalPages > 1"
                          :currentPage="currentPage"
                          :totalPages="totalPages"
                          @update:currentPage="updateCurrentPage"
                        />
                    </div>
                    
                </div>
            </section>

    </div>
</template>
