<script setup>
const props = defineProps({
    title: {
        type: String,
        default: ''
    },
    heroImage: {
        type: Array,
        default: () => []
    },
    contractType: {
        type: Array,
        default: () => []
    },
    contractHours: {
        type: Array,
        default: () => []
    },
    sector: {
        type: Array,
        default: () => []
    },
    location: {
        type: String,
        default: ''
    },
    postCode: {
        type: String,
        default: ''
    },
    salary: {
        type: String,
        default: ''
    }
    
})

//Pick a random hero image if available
const randomHeroImage = computed(() => {
  if (!props.heroImage?.length) return null
  const randomIndex = Math.floor(Math.random() * props.heroImage.length)
  return props.heroImage[randomIndex]
})

//Optional: image count
const heroImageCount = computed(() => props.heroImage?.length || 0)

// Print all data to console
// console.log('=== HERO COMPONENT - ALL PROPS ===')
// console.log('title:', props.title)
// console.log('subHeading:', props.subHeading)
// console.log('caption:', props.caption)
// console.log('mobileImage:', JSON.stringify(props.mobileImage, null, 2))
// console.log('desktopImage:', JSON.stringify(props.desktopImage, null, 2))
// console.log('heroImage:', JSON.stringify(props.heroImage, null, 2))
// console.log('=== END PROPS ===')
</script>
<template>
    <section class="hero hero--jobs__listing wave-bottom">
        <NuxtImg
            v-if="randomHeroImage?.url"
            :src="randomHeroImage.url"
            :alt="randomHeroImage.alt || title"
            loading="lazy"
            width="1920"
            height="1080"
        />
        <div class="hero__inner">
            <div class="hero__motto">
                <h1>{{ title }}</h1>
            </div>
            <div class="hero__tags">
                <div class="button button--gray">{{ sector[0]?.title || 'N/A' }}</div>
                <div class="button button--gray">{{ contractType[0]?.title || 'N/A' }}</div>
                <div class="button button--gray">{{ contractHours[0]?.title || 'N/A' }}</div>
                <div class="button button--gray">{{ location }}</div>
                <div class="button button--gray">{{ salary }}</div>
            </div>
        </div>
    </section>
</template>