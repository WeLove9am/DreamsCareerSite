<script setup>
const props = defineProps({
    subHeading: {
        type: String,
        default: ''
    },
    subHeading2: {
        type: String,
        default: ''
    },
    caption: {
        type: String,
        default: ''
    },
    caption2: {
        type: String,
        default: ''
    },
    heroImage: {
        type: Array,
        default: () => []
    },
    buttonCaption: {
        type: String,
        default: ''
    }
    
})

</script>
<template>
    <section class="section intro">
        <div class="container intro__inner">
            <div class="intro__text">
                <h2>{{ subHeading }}</h2>
                <h3>{{ subHeading2 }}</h3>
                <p>{{ caption }}</p>
                <p>{{ caption2 }}</p>
                <div class="retail actions">
                    <a class="button button--primary" href="/jobs?sector=Retail">{{ buttonCaption }}</a>
                </div>
            </div>
            <NuxtImg
                    v-if="heroImage?.[0]?.url" 
                    :src="heroImage[0].url" 
                    :alt="heroImage[0]?.alt || subHeading"
                    loading="lazy"
                    class="intro__image"
                    width="418" height="306"/>
        </div>
    </section>
</template>