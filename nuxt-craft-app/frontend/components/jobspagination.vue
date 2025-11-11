<script setup>
import { computed, nextTick } from 'vue'

const props = defineProps({
  currentPage: { type: Number, required: true },
  totalPages: { type: Number, required: true }
})

const emit = defineEmits(['update:currentPage'])

// Normalize numbers
const cur = computed(() => Number(props.currentPage) || 1)
const total = computed(() => Math.max(1, Number(props.totalPages) || 1))

// Smart pagination with ellipses
const visiblePages = computed(() => {
  const c = cur.value
  const t = total.value
  const pages = []

  if (t <= 5) return Array.from({ length: t }, (_, i) => i + 1)
  if (c <= 3) return [1, 2, 3, '...', t]
  if (c >= t - 2) return [1, '...', t - 2, t - 1, t]
  return [1, '...', c - 1, c, c + 1, '...', t]
})

// Handle click + smooth scroll
const goToPage = async (page) => {
  if (typeof page !== 'number' || page < 1 || page > total.value || page === cur.value)
    return

  emit('update:currentPage', page)
  await nextTick()

  // Scroll to first job item or job list
  const firstJob = document.querySelector('.job-item')
  if (firstJob) {
    firstJob.scrollIntoView({ behavior: 'smooth', block: 'start' })
  } else {
    const list = document.querySelector('.job-list')
    if (list) list.scrollIntoView({ behavior: 'smooth', block: 'start' })
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
</script>

<template>
  <nav v-if="total > 1" class="pagination" role="navigation" aria-label="Job pagination">
    <ul class="pagination__list">
      
      <!-- Prev Button -->
      <li class="pagination__item" v-if="cur > 1">
        <a href="javascript:void(0)" class="pagination__link" @click.prevent="goToPage(cur - 1)">←</a>
      </li>

      <!-- Page Numbers -->
      <li v-for="p in visiblePages" :key="p + '-page'" class="pagination__item">
        <span v-if="p === '...'" class="pagination__link pagination__ellipsis">…</span>

        <a
          v-else
          href="javascript:void(0)"
          class="pagination__link"
          :class="{ 'is-active': p === cur }"
          @click.prevent="goToPage(p)"
        >
          {{ p }}
        </a>
      </li>

      <!-- Next Button -->
      <li class="pagination__item" v-if="cur < total">
        <a href="javascript:void(0)" class="pagination__link" @click.prevent="goToPage(cur + 1)">→</a>
      </li>
    </ul>
  </nav>
</template>
