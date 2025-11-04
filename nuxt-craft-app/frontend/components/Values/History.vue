<script setup>
const props = defineProps({
    values: {
        type: Array,
        default: () => []
    },
    desktopImage: {
        type: Array,
        default: () => []
    },
    mobileImage: {
        type: Array,
        default: () => []
    }
})


</script>
<template>
    <section class="section">
        <div class="container" >
                <div class="container__title">
                    <NuxtImg
                        v-if="mobileImage?.[0]?.url" 
                        :src="mobileImage[0].url" 
                        :alt="mobileImage[0]?.alt || ''"
                        loading="lazy"
                        width="218" height="187"/>
                    <NuxtImg
                        v-if="desktopImage?.[0]?.url" 
                        :src="desktopImage[0].url" 
                        :alt="desktopImage[0]?.alt || ''"
                        loading="lazy"
                        width="1360" height="117"/>
                </div>


                <div class="swiper slider-values">
                    <div class="swiper-wrapper">
                        <div class="swiper-slide"  v-for="item in values" :key="item.id">
                            <div class="slider-values-slide">
                                <div class="slider-values-slide__top">
                                    <NuxtImg
                                        v-if="item.image?.[0]?.url" 
                                        :src="item.image[0].url" 
                                        :alt="item.image[0].alt || item.title"
                                        loading="lazy"
                                        width="120" height="120" 
                                    />
                                    <p>{{ item.title }}</p>
                                </div>
                                <div class="slider-values-slide__header">
                                    <h3>{{ item.caption }}</h3>
                                </div>
                                <p class="slider-values-slide__body">{{ item.copy }}</p>
                            </div>
                        </div>
                        
                    </div>
                    <div class="slider-values__controls">
                        <div class="slider-values__progress">
                            <div class="slider-values__progress-bar">
                                <div class="slider-values__progress-fill"></div>
                            </div>
                        </div>
                        <div class="slider-values__pagination"></div>
                        <div class="slider-values__navigation">
                            <button class="swiper-button-prev slider-values__nav-btn slider-values__nav-btn--prev">
                                <svg>
                                    <use xlink:href="~/assets/images/sprites.svg#chevron-circle-left"></use>
                                </svg>
                            </button>
                            <button class="swiper-button-next slider-values__nav-btn slider-values__nav-btn--next">
                                <svg>
                                    <use xlink:href="~/assets/images/sprites.svg#chevron-circle-right"></use>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>


        </div>
    </section>
</template>