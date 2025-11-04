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
    subHeading2: {
        type: String,
        default: ''
    },
    copy: {
        type: String,
        default: ''
    },
    fullName: {
        type: String,
        default: ''
    },
    jobTitle: {
        type: String,
        default: ''
    },
    features: {
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
            <div class="slider-features">
                <div class="slider-features__left">
                    <div class="swiper slider-features__thumbs">
                        <div class="swiper-wrapper">
                            <div class="swiper-slide" v-for="item in features" :key="item.id">
                                <div class="slider-feature-slide">
                                    <div class="slider-feature-slide__header">
                                        <h3>{{ item.title }}</h3>
                                    </div>
                                    <div class="slider-feature-slide__body">
                                        <div class="slider-features__imageSmall">
                                            <NuxtImg
                                                v-if="item.image?.[0]?.url" 
                                                :src="item.image[0].url" 
                                                :alt="item.image[0].alt || item.title"
                                                loading="lazy"
                                            />
                                        </div>
                                        <p class="slider-feature-slide__description" style="white-space: break-spaces">{{ item.copy }}</p>
                                    </div>
                                    <div class="slider-feature-slide__bottom"><span>{{ item.fullName }}</span><span>{{ item.jobTitle }}</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="slider-features__right">
                    <div class="swiper slider-features__main">
                        <div class="swiper-wrapper">
                            <div class="swiper-slide" v-for="item in features" :key="item.id">
                                <div class="slider-features__image">
                                    <NuxtImg
                                        v-if="item.image?.[0]?.url" 
                                        :src="item.image[0].url" 
                                        :alt="item.image[0].alt || item.title"
                                        loading="lazy"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="slider-features__controls">
                <div class="slider-features__progress">
                    <div class="slider-features__progress-bar">
                        <div class="slider-features__progress-fill"></div>
                    </div>
                </div>
                <div class="slider-features__navigation">
                    <button class="swiper-button-prev slider-features__nav-btn slider-features__nav-btn--prev">
                        <svg>
                            <use xlink:href="~/assets/images/sprites.svg#chevron-circle-left"></use>
                        </svg>
                    </button>
                    <button class="swiper-button-next slider-features__nav-btn slider-features__nav-btn--next">
                        <svg>
                            <use xlink:href="~/assets/images/sprites.svg#chevron-circle-right"></use>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </section>
</template>
