<script setup>
import { computed, nextTick } from 'vue'

// Props
const props = defineProps({
  currentPage: { type: Number, required: true },
  totalPages: { type: Number, required: true }
})

// Emits
const emit = defineEmits(['update:currentPage'])

// Coerce to safe numbers
const cur = computed(() => Number(props.currentPage) || 1)
const total = computed(() => Math.max(1, Number(props.totalPages) || 1))

// 🔹 Smart pagination logic with ellipses
const visiblePages = computed(() => {
  const c = cur.value
  const t = total.value
  const pages = []

  // Case 1: few pages → show all
  if (t <= 5) {
    for (let i = 1; i <= t; i++) pages.push(i)
    return pages
  }

  // Case 2: near start → show first 3, ellipsis, last
  if (c <= 3) {
    pages.push(1, 2, 3, '...', t)
    return pages
  }

  // Case 3: near end → show first, ellipsis, last 3
  if (c >= t - 2) {
    pages.push(1, '...', t - 2, t - 1, t)
    return pages
  }

  // Case 4: middle range → show first, ellipsis, current ±1, ellipsis, last
  pages.push(1, '...', c - 1, c, c + 1, '...', t)
  return pages
})

const goToPage = async (page) => {
  if (typeof page !== 'number') return
  if (page < 1 || page > total.value || page === cur.value) return

  emit('update:currentPage', page)
  await nextTick()

  const list = document.querySelector('.job-list')
  if (list) list.scrollIntoView({ behavior: 'smooth', block: 'start' })
  else window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <nav v-if="total > 1" class="pagination" role="navigation" aria-label="Job pagination">
    <ul class="pagination__list">
      <!-- Prev -->
      <li v-if="cur > 1" class="pagination__item">
        <button class="pagination__link" @click="goToPage(cur - 1)">←</button>
      </li>

      <!-- Pages -->
      <li v-for="p in visiblePages" :key="p + '-page'" class="pagination__item">
        <span v-if="p === '...'" class="pagination__link pagination__ellipsis">…</span>
        <button
          v-else
          class="pagination__link"
          :class="{ 'is-active': p === cur }"
          @click="goToPage(p)"
        >
          {{ p }}
        </button>
      </li>

      <!-- Next -->
      <li v-if="cur < total" class="pagination__item">
        <button class="pagination__link" @click="goToPage(cur + 1)">→</button>
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
