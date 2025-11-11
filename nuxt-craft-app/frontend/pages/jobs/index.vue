<script setup>
import { ref, watch, computed, nextTick } from 'vue'
import { useHead } from '#imports'
import { usePaginatedData } from '@/composables/usePaginatedData'
import { useGraphQL } from '@/composables/useGraphQL'
import { usePreview } from '@/composables/usePreview'
import { JOB_POSTS_QUERY } from '@/queries/jobs.mjs'

const graphql = useGraphQL()
const { isPreview, previewToken, previewTimestamp } = usePreview()

// ✅ Reactive filters
const search = ref('')
const location = ref('')
const distance = ref('')
const selectedSectors = ref([])
const selectedContracts = ref([])

// ✅ Fetch all jobs (client-side filtering)
const fetchBlogData = async () => {
  try {
    const result = await graphql.query(
      JOB_POSTS_QUERY,
      { limit: 9999, offset: 0 },
      { previewToken: previewToken.value }
    )
    return {
      content: result?.entry || {},
      posts: result?.jobListEntries || [],
      total: result?.entryCount || 0
    }
  } catch (error) {
    console.error('Error fetching jobs:', error)
    throw error
  }
}

const {
  currentPage,
  data,
  loading,
  error,
  fetchPageData
} = usePaginatedData(fetchBlogData)

if (isPreview.value) fetchPageData(currentPage.value)

// ✅ Utilities
async function getCoordinatesFromLocation(locationName) {
  if (!locationName) return null
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}`
    )
    const results = await res.json()
    if (results.length > 0) {
      return { lat: parseFloat(results[0].lat), lon: parseFloat(results[0].lon) }
    }
  } catch (e) {
    console.error('Geocode error:', e)
  }
  return null
}

function haversineDistance(lat1, lon1, lat2, lon2) {
  const toRad = deg => (deg * Math.PI) / 180
  const R = 3958.8 // miles
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// ✅ Filtering logic
const filteredJobs = ref([])

async function applyFilters() {
  let jobs = data.value?.posts || []

  // Keyword
  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    jobs = jobs.filter(
      job =>
        job.title?.toLowerCase().includes(q) ||
        job.jobDescription?.toLowerCase().includes(q)
    )
  }

  // Sector
  if (selectedSectors.value.length) {
    jobs = jobs.filter(job =>
      job.sector?.some(s => selectedSectors.value.includes(s.title))
    )
  }

  // Contract type
  if (selectedContracts.value.length) {
    jobs = jobs.filter(job =>
      job.contractType?.some(c => selectedContracts.value.includes(c.title))
    )
  }

  // Distance
  if (distance.value && Number(distance.value) > 0) {
    if (!location.value.trim()) {
      await nextTick()
      const locInput = document.querySelector(
        '.form-location input[name="location-code"]'
      )
      if (locInput) locInput.focus()
    } else {
      const coords = await getCoordinatesFromLocation(location.value)
      if (coords) {
        jobs = jobs.filter(job => {
          const cat = job.postcodesCat?.[0]
          if (!cat?.latitude || !cat?.longitude) return false
          const dist = haversineDistance(
            coords.lat,
            coords.lon,
            parseFloat(cat.latitude),
            parseFloat(cat.longitude)
          )
          return dist <= Number(distance.value)
        })
      }
    }
  }

  filteredJobs.value = jobs
}

// ✅ Run filters
// 1️⃣ When data first loads
watch(data, applyFilters, { immediate: true })

// 2️⃣ When filters change — reset to page 1
watch([search, location, distance, selectedSectors, selectedContracts], async () => {
  await applyFilters()
  currentPage.value = 1
})

// ✅ Pagination
const itemsPerPage = 10
const filteredTotalPages = computed(() =>
  Math.ceil(filteredJobs.value.length / itemsPerPage)
)
const paginatedJobs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredJobs.value.slice(start, start + itemsPerPage)
})

// ✅ Change page
function goToPage(page) {
  if (page < 1 || page > filteredTotalPages.value) return
  currentPage.value = page
  nextTick(() => {
    const firstJob = document.querySelector('.job-list .job-item')
    if (firstJob) firstJob.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
}

// ✅ Filter lists
const allSectors = computed(() => {
  const jobs = data.value?.posts || []
  const sectors = new Set()
  jobs.forEach(job => job.sector?.forEach(s => s?.title && sectors.add(s.title)))
  return Array.from(sectors).sort()
})

const allContractTypes = computed(() => {
  const jobs = data.value?.posts || []
  const types = new Set()
  jobs.forEach(job => job.contractType?.forEach(c => c?.title && types.add(c.title)))
  return Array.from(types).sort()
})

// ✅ Reset filters
function resetFilters() {
  search.value = ''
  location.value = ''
  distance.value = ''
  selectedSectors.value = []
  selectedContracts.value = []
  currentPage.value = 1
}

// ✅ Helpers
const content = computed(() => data.value?.content || {})
useHead(() => ({ title: content.value?.title || 'Jobs' }))

const truncate = (text, len) => (text ? text.slice(0, len) + '...' : '')
const openApply = (link, target = '_self') => {
  if (typeof window !== 'undefined' && link) window.open(link, target)
}

const handleHeroSearch = ({ keyword, location: loc }) => {
  search.value = keyword
  location.value = loc
  applyFilters()
  nextTick(() => {
    const firstJob = document.querySelector('.job-list .job-item')
    if (firstJob) firstJob.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
}
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
          <form @submit.prevent>
            <!-- Job Sector -->
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

            <!-- Contract Type -->
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

            <!-- Distance -->
            <div class="job-form__item">
              <h3>Distance (miles)</h3>
              <div class="job-form__inputs">
                <template v-for="m in [10, 20, 30, 40, 50]" :key="m">
                  <label class="checkbox button">
                    <input
                      class="checkbox-input"
                      type="checkbox"
                      :value="String(m)"
                      :checked="distance === String(m)"
                      @change="distance = distance === String(m) ? '' : String(m)"
                    />
                    <span class="checkbox-box__label">{{ m }}</span>
                  </label>
                </template>
              </div>
            </div>

            <!-- Reset -->
            <div class="job-form__item">
              <button
                class="button button--primary text-uppercase"
                type="button"
                @click="resetFilters"
              >
                Reset
              </button>
            </div>
          </form>
        </div>

        <!-- Job List -->
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
              <div v-for="entry in paginatedJobs" :key="entry.id" class="job-item">
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
                        <li>{{ entry.contractType[0]?.title || 'N/A' }}</li>
                        <li>{{ entry.contractHours[0]?.title || 'N/A' }}</li>
                        <li>
                          {{ entry.location || 'N/A' }}, {{ entry.postCode || 'N/A' }}
                        </li>
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
                    @click="openApply(`/jobs/${entry.slug}/${entry.jobId}`, '_blank')"
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
                      <ul><li>No jobs found. Please try a different search or filter.</li></ul>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </template>
        </div>
      </div>

      <!-- Pagination -->
      <div class="container">
        <div class="jobs__pagination">
          <Jobspagination
            v-if="filteredTotalPages > 1"
            :currentPage="currentPage"
            :totalPages="filteredTotalPages"
            @update:currentPage="goToPage"
          />
        </div>
      </div>
    </section>
  </div>
</template>
