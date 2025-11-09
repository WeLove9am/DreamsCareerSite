<script setup>
import { ref, watch, computed, nextTick } from 'vue'
import { useHead } from '#imports'
import { usePaginatedData } from '@/composables/usePaginatedData'
import { useGraphQL } from '@/composables/useGraphQL'
import { usePreview } from '@/composables/usePreview'
import { JOB_POSTS_QUERY } from '@/queries/jobs.mjs'

const graphql = useGraphQL()
const { isPreview, previewToken, previewTimestamp } = usePreview()

// Filters
const search = ref('')          // keyword: title + description
const location = ref('')        // location + postCode
const selectedSectors = ref([]) // (reserved for future use)
const distance = ref(0)         // (reserved for future use)

// Fetcher used by pagination composable (still fetches server pages; we paginate client-side after filtering)
const fetchBlogData = async (page, perPage) => {
  const result = await graphql.query(JOB_POSTS_QUERY, {
    limit: 9999, // fetch all jobs in one go
    offset: 0
  }, {
    previewToken: previewToken.value
  })


  return {
    content: result?.entry || {},
    posts: result?.jobListEntries || [],
    total: result?.entryCount || 0
  }
}

const {
  currentPage,
  data,
  totalPages,   // not used for UI now (we compute client-side)
  loading,
  error,
  updateCurrentPage, // not used; client pagination sets currentPage directly
  fetchPageData,
  refresh
} = usePaginatedData(fetchBlogData)

watch([isPreview, previewToken], () => {
  if (isPreview.value && previewToken.value) fetchPageData()
})

// ---------- Filtering + client-side pagination ----------
const itemsPerPage = 10

const filteredJobs = computed(() => {
  let jobs = data.value?.posts || []

  // Keyword filter (title + jobDescription)
  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    jobs = jobs.filter(
      (job) =>
        job.title?.toLowerCase().includes(q) ||
        job.jobDescription?.toLowerCase().includes(q)
    )
  }

  // Location filter (location + postCode)
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

const totalFilteredPages = computed(() =>
  Math.ceil(filteredJobs.value.length / itemsPerPage) || 1
)

const paginatedJobs = computed(() => {
  // Clamp currentPage within range to avoid empty pages after filtering
  if (currentPage.value > totalFilteredPages.value) currentPage.value = 1
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredJobs.value.slice(start, end)
})

const content = computed(() => data.value?.content || {})

useHead(() => ({
  title: content.value?.title || 'Jobs'
}))

// Utils
const truncate = (text, maxLength) => (!text ? '' : text.slice(0, maxLength) + '...')

// Open links safely (SSR-safe)
function openApply(link, target = '_self') {
  if (typeof window !== 'undefined' && link) window.open(link, target)
}

// Handle search emitted from JobsHero
const handleHeroSearch = ({ keyword, location: loc }) => {
  search.value = keyword || ''
  location.value = loc || ''

  // Reset to first page, then scroll to list
  currentPage.value = 1
  nextTick(() => {
    const firstJob = document.querySelector('.job-item')
    if (firstJob) firstJob.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
}

// Also reset page when filters change from elsewhere
watch([search, location], () => {
  currentPage.value = 1
})
</script>

<template>
  <div :key="previewTimestamp">
    <JobsHero
      :title="content?.title"
      :subHeading="content?.subHeading"
      :caption="content?.caption"
      :mobileImage="content?.mobileImage"
      :desktopImage="content?.desktopImage"
      :heroImage="content?.heroImage"
      @search="handleHeroSearch"
    />

    <section class="jobs">
      <div class="container">
        <div class="job-form">
          <form @submit.prevent>
            <div class="job-form__item">
              <h3>Job Sector</h3>
              <div class="job-form__inputs">
                <label class="checkbox button">
                  <input class="checkbox-input" type="checkbox" name="checkbox" /><span class="checkbox-box__label">Retail</span>
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
                  <input class="checkbox-input" type="checkbox" name="checkbox" /><span class="checkbox-box__label">Permanent</span>
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
              <h3>Location</h3>
              <div class="job-form__inputs job-form__inputs--col">
                <select class="select" name="distance">
                  <option value="10">Within 10 miles</option>
                  <option value="20">Within 20 miles</option>
                  <option value="30">Within 30 miles</option>
                  <option value="40">Within 40 miles</option>
                  <option value="50">Within 50 miles</option>
                </select>
                <input
                  class="input"
                  type="text"
                  placeholder="Location or postcode"
                  name="location"
                  v-model="location"
                />
                <input
                  class="input"
                  type="text"
                  placeholder="Search jobs by keyword"
                  name="search"
                  v-model="search"
                />
                <button class="button button--primary text-uppercase" type="button" @click="currentPage = 1">
                  Update
                </button>
              </div>
            </div>
          </form>
        </div>

        <div class="job-list">
          <div v-if="loading" class="loading-container">
            <span class="spinner"></span>
            <span class="loading-text">Loading jobs...</span>
          </div>

          <div v-else-if="error">Error: {{ error.message }}</div>

          <div v-else>
            <div class="job-item" v-for="entry in paginatedJobs" :key="entry.id">
              <div class="job-item__info">
                <h3>{{ entry.title }}</h3>
                <p v-html="truncate(entry.jobDescription, 300)"></p>

                <div class="job-item__wrapper">
                  <div class="job-item__title">
                    <ul>
                      <li>Contract type:</li>
                      <li>Contract hours:</li>
                      <li>Location:</li>
                      <li>Salary:</li>
                    </ul>
                  </div>
                  <div class="job-item__info">
                    <ul>
                      <li>{{ entry.contractType?.[0]?.title || 'N/A' }}</li>
                      <li>{{ entry.contractHours?.[0]?.title || 'N/A' }}</li>
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
                  @click="openApply(`/jobs/${entry.slug}`)"
                >
                  Read more
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div class="container">
        <!--<div class="debug" style="text-align:center; margin-top:1rem;">
          Debug → currentPage: {{ currentPage }}, 
          totalFilteredPages: {{ totalFilteredPages }},
          filteredJobs: {{ filteredJobs.length }},
          paginatedJobs: {{ paginatedJobs.length }}
        </div>-->


        <div class="jobs__pagination">
          <Jobspagination
            v-if="filteredJobs.length > itemsPerPage"
            :currentPage="currentPage"
            :totalPages="totalFilteredPages"
            @update:currentPage="(p) => currentPage = p"
          />


        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  min-height: 150px;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 4px solid rgba(37, 17, 99, 0.2);
  border-top-color: #251163;
  border-radius: 50%;
  animation: spin 0.9s linear infinite;
}

.loading-text {
  font-weight: 600;
  color: #251163;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
