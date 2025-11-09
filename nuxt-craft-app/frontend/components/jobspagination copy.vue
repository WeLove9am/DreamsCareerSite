<script setup>
import { nextTick } from 'vue'

// Props
const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  }
})

// Emits
const emit = defineEmits(['update:currentPage'])

// Go to a specific page
const goToPage = async (page) => {
  if (page >= 1 && page <= props.totalPages) {
    emit('update:currentPage', page)

    // Wait until DOM updates, then scroll smoothly to top of job list
    await nextTick()
    const firstJob = document.querySelector('.job-list')
    if (firstJob) {
      firstJob.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
}

// Computed visible pages with ellipsis
const getVisiblePages = () => {
  const pages = []
  const total = props.totalPages
  const current = props.currentPage
  const delta = 2 // pages to show before/after current

  const left = Math.max(2, current - delta)
  const right = Math.min(total - 1, current + delta)

  pages.push(1)

  if (left > 2) {
    pages.push('...')
  }

  for (let i = left; i <= right; i++) {
    pages.push(i)
  }

  if (right < total - 1) {
    pages.push('...')
  }

  if (total > 1) {
    pages.push(total)
  }

  return pages
}
</script>

<template>
  <nav class="pagination" role="navigation" aria-label="Job pagination">
    <ul class="pagination__list">
      <!-- Previous Button -->
      <li
        v-if="currentPage > 1"
        class="pagination__item"
      >
        <button
          class="pagination__link"
          @click="goToPage(currentPage - 1)"
          aria-label="Previous Page"
        >
          ←
        </button>
      </li>

      <!-- Page Numbers with Ellipsis -->
      <li
        v-for="page in getVisiblePages()"
        :key="page + '-page'"
        class="pagination__item"
      >
        <span
          v-if="page === '...'"
          class="pagination__link pagination__ellipsis"
        >
          ...
        </span>
        <button
          v-else
          class="pagination__link"
          :class="{ 'is-active': page === currentPage }"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>
      </li>

      <!-- Next Button -->
      <li
        v-if="currentPage < totalPages"
        class="pagination__item"
      >
        <button
          class="pagination__link"
          @click="goToPage(currentPage + 1)"
          aria-label="Next Page"
        >
          →
        </button>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.pagination__ellipsis {
  cursor: default;
  opacity: 0.6;
}
</style>
