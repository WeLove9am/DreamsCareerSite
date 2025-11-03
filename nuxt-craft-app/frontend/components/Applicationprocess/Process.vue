<script setup>
const props = defineProps({
    subTitle: {
        type: String,
        default: ''
    },
    steps: {
        type: Array,
        default: () => []
    }
    
})

</script>
<template>


            <section class="section">
                <div class="container">
                    <div class="section-header">
                        <h2 v-if="subTitle">{{ subTitle }}</h2>
                    </div>
                    <div class="steps-slider__wrapper" data-steps-slider="">
                        <div class="steps-slider" data-slider-container="">
                            <div class="steps-slider-slide" v-for="(item, index) in steps" :key="item.id">
                                <NuxtImg
                                    v-if="item.image?.[0]?.url" 
                                    :src="item.image[0].url" 
                                    :alt="item.image[0].alt || item.title"
                                    loading="lazy"
                                    class="steps-slider__slide-img"
                                    width="706" height="320"
                                />
                                <div class="steps-slider__slide-inner" :data-slide-index="`${index}`">
                                    <div class="steps-slider__number">{{ index + 1}}</div>
                                    <div class="steps-slider__content">
                                        <h3 class="steps-slider__title">{{ item.title }}</h3>
                                        <div class="steps-slider__subtitle">{{ item.subTitle }}</div>
                                        <p class="steps-slider__text">{{ item.copy }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="steps-slider__progress">
                            <div class="steps-slider__progress-fill" data-progress-fill=""></div>
                        </div>
                        <div class="steps-slider__navigation">
                            <button class="steps-slider__nav-btn" data-nav-prev="" aria-label="Previous step">
                                <svg>
                                    <use xlink:href="~/assets/images/sprites.svg#chevron-circle-left"></use>
                                </svg>
                            </button>
                            <button class="steps-slider__nav-btn" data-nav-next="" aria-label="Next step">
                                <svg>
                                    <use xlink:href="~/assets/images/sprites.svg#chevron-circle-right"></use>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </section>


</template>