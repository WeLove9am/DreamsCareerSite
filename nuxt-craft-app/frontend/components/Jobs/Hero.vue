<script setup>
import { ref, watch } from 'vue'
import { useRoute } from '#app'
const route = useRoute()
// Read ?search from URL (SSR safe)
const initialQuerySearch = computed(() => route.query.search ?? '')


const props = defineProps({
    title: {
        type: String,
        default: ''
    },
    subHeading: {
        type: String,
        default: ''
    },
    caption: {
        type: String,
        default: ''
    },
    mobileImage: {
        type: Array,
        default: () => []
    },
    desktopImage: {
        type: Array,
        default: () => []
    },
    heroImage: {
        type: Array,
        default: () => []
    },
    reset: Boolean
})

// 👇 Define emit
const emit = defineEmits(['search'])

// Local refs for form inputs
const keyword = ref('')
const locationCode = ref('')

// Handle form submission
const handleSearch = (e) => {
  e.preventDefault()
  emit('search', {
    keyword: keyword.value.trim(),
    location: locationCode.value.trim()
  })
}

// Fire search manually (same as form submit)
const triggerSearch = () => {
  emit('search', {
    keyword: keyword.value.trim(),
    location: locationCode.value.trim()
  })
}

onMounted(() => {
  if (initialQuerySearch.value) {
    keyword.value = initialQuerySearch.value
    triggerSearch()
  }
})

// Reset inputs when reset prop changes
watch(() => props.reset, () => {
  keyword.value = ''
  locationCode.value = ''
})
</script>
<template>
    <section class="hero hero--jobs wave-bottom">
        <NuxtImg
            v-if="heroImage?.[0]?.url" 
            :src="heroImage[0].url" 
            :alt="heroImage[0]?.alt || title"
            loading="lazy"
            width="1920" height="1080"
        />
        <div class="hero__inner">
            
                <div class="hero__motto">
                    <h1 v-if="subHeading">{{ subHeading }}</h1>
                    <NuxtImg
                        v-if="mobileImage?.[0]?.url" 
                        :src="mobileImage[0].url" 
                        :alt="mobileImage[0]?.alt || subHeading"
                        loading="lazy"
                        class="hero__images hidden-desktop"/>
                    <NuxtImg
                        v-if="desktopImage?.[0]?.url" 
                        :src="desktopImage[0].url" 
                        :alt="desktopImage[0]?.alt || subHeading"
                        loading="lazy"
                        class="hero__images visible-desktop"/>
                    <p v-if="caption">{{ caption }}</p>
                </div>
                <form class="form-location form-location--search" @submit.prevent="handleSearch">
                    <input
                    type="text"
                    v-model="keyword"
                    placeholder="Search jobs by keyword"
                    name="search"
                    />
                    <input
                    type="text"
                    v-model="locationCode"
                    placeholder="Location or postcode"
                    name="location-code"
                    />
                    <button class="button button--primary" type="submit">Search</button>
                </form>
        </div>
    </section>
</template>