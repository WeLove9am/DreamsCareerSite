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
    vimeoVideoId: {
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
    <section class="section hero hero--video wave-bottom">
        <NuxtImg
            v-if="heroImage?.[0]?.url" 
            :src="heroImage[0].url" 
            :alt="heroImage[0]?.alt || title"
            loading="lazy"
            width="1920" height="1080"
        />
        <div class="hero__inner">
            <div class="hero__motto">
                <h2>{{ subHeading }}
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
                </h2>
                <button v-if="vimeoVideoId" class="button button--primary text-uppercase" id="openVideoBtn" :data-vimeo-id="vimeoVideoId">{{ caption }}</button>
            </div>
            <dialog id="videoModal">
                <div class="modal-video-container">
                    <div class="loader"></div>
                </div>
                <button class="modal-close" id="closeModalBtn">&times;</button>
            </dialog>
        </div>
    </section>
</template>