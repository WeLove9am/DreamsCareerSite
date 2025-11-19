<script setup>
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
    }
    
})
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
    <section class="hero hero--distribution wave-bottom">
        <NuxtImg
            v-if="heroImage?.[0]?.url" 
            :src="heroImage[0].url" 
            :alt="heroImage[0]?.alt || title"
            loading="lazy"
            width="1920" height="1080"
        />
        <div class="hero__inner">
            <div class="hero__motto department">
                <h1>{{ subHeading }}</h1>
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
            </div>
            <p class="copy_text">{{ caption }}</p>
        </div>
    </section>
</template>