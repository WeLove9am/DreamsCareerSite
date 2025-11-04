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
                <form class="form-location form-location--search" action="#" method="post">
                    <input type="text" placeholder="Search jobs by keyword" name="search">
                    <input type="text" placeholder="Location or postcode" name="location-code">
                    <button class="button button--primary" type="submit">Search</button>
                </form>
        </div>
    </section>
</template>