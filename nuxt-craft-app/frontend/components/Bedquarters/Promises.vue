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
    promises: {
        type: Array,
        default: () => []
    }
})
</script>
<template>
<section class="section">
            <div class="container">
                <div class="section-header">
                    <h2>{{ subHeading }}</h2>
                    <h3>{{ subHeading2 }}</h3>
                </div>
            </div>
            <div class="container">
                <div class="slider-spotlight">
                    <div class="swiper slider-spotlight__thumbs">
                        <div class="swiper-wrapper">
                            <div class="swiper-slide slider-spotlight__thumb-slide" data-duration="5" v-for="item in promises" :key="item.id">
                                <div class="slider-spotlight__thumb-content">
                                    <h4>{{ item.title }}</h4>
                                    <p>{{ item.copy }}</p>
                                </div>
                                <div class="slider-spotlight__progress">
                                    <div class="slider-spotlight__progress-fill"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="swiper slider-spotlight__main">
                        <div class="swiper-wrapper">
                            <div class="swiper-slide slider-spotlight__slide" v-for="item in promises" :key="item.id">
                                <div class="card card--image">
                                    <NuxtImg
                                        v-if="item.image?.[0]?.url" 
                                        :src="item.image[0].url" 
                                        :alt="item.image[0].alt || item.subTitle"
                                        loading="lazy"
                                        width="543" height="459" 
                                    />
                                    <div class="card__body">
                                        <h3>{{ item.subTitle }}</h3>
                                        <h4>{{ item.caption }}</h4>
                                        <h5>{{ item.copy2 }}</h5>
                                        <p>{{ item.copy3 }}</p>
                                        <p>{{ item.copy4 }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
</template>
