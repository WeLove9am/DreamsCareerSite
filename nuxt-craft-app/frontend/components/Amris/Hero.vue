<script setup>
const props = defineProps({
    title: {
        type: String,
        default: ''
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
                    <h1>[AMRIS title]</h1>
                </div>
        </div>
    </section>
</template>