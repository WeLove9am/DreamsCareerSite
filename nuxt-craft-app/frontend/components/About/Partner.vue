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
    buttonCaption: {
        type: String,
        default: ''
    },
    buttonLink: {
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

const nl2br = (value = '') => value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/\r?\n/g, '<br>')
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
                <p v-html="nl2br(copy2)"></p>
                <a
                    v-if="buttonCaption && buttonLink"
                    class="button button--primary"
                    :href="buttonLink"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {{ buttonCaption }}
                </a>
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
                    class="partners__image-three"
                    :src="image3[0].url" 
                    :alt="image3[0]?.alt || subTitle"
                    loading="lazy" style="max-height: 110px; width: auto;"
                />
            </div>
        </div>
    </section>
    
</template>