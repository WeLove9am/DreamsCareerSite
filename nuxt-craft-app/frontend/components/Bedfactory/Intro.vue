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
    heroImage: {
        type: Array,
        default: () => []
    },
    list: {
        type: Array,
        default: () => []
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
                <ul> 
                    <li v-for="item in list" :key="item.id"><b>{{ item.title }}</b> – {{ item.caption }}</li>
                </ul>
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
