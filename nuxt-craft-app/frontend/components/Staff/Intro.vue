<script setup>
const props = defineProps({
    subHeading: {
        type: String,
        default: ''
    },
    copy: {
        type: String,
        default: ''
    },
    image: {
        type: Array,
        default: () => []
    }
})

</script>
<template>
    <section class="page-header">
        <div class="container">
            <NuxtImg
                v-if="image?.[0]?.url" 
                :src="image[0].url" 
                :alt="image[0]?.alt || subHeading"
                loading="lazy"
                class="page-header--image"
            />
            <p class="page-header--title" v-if="subHeading">{{ subHeading }}</p>
            <h4 class="page-header--texst" v-if="copy">{{ copy }}</h4>
        </div>
    </section>
</template>