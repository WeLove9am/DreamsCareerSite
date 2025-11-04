<script setup>
const props = defineProps({
    subTitle: {
        type: String,
        default: ''
    },
    copy: {
        type: String,
        default: ''
    },
    copy2: {
        type: String,
        default: ''
    },
    image: {
        type: Array,
        default: () => []
    },
    image2: {
        type: Array,
        default: () => []
    },
    image3: {
        type: Array,
        default: () => []
    }
    
})
</script>
<template>

    <section class="section partners">
        <div class="container">
            <div class="partners__img">
                <NuxtImg
                    v-if="image?.[0]?.url" 
                    :src="image[0].url" 
                    :alt="image[0]?.alt || subTitle"
                    loading="lazy"
                    data-scrollspy="animate__fadeInUp" data-delayTime="250"
                />
            </div>
            <div class="partners__info" data-scrollspy="animate__fadeInUp">
                <h3>{{ subTitle }}</h3>
                <h4>{{ copy }}</h4>
                <p>{{ copy2 }}</p>
            </div>
            <div class="partners__bottom" data-scrollspy="animate__fadeInUp" data-delayTime="500">
                <NuxtImg
                    v-if="image2?.[0]?.url" 
                    :src="image2[0].url" 
                    :alt="image2[0]?.alt || subTitle"
                    loading="lazy"
                />
                <NuxtImg
                    v-if="image3?.[0]?.url" 
                    :src="image3[0].url" 
                    :alt="image3[0]?.alt || subTitle"
                    loading="lazy"
                />
            </div>
        </div>
    </section>
    
</template>