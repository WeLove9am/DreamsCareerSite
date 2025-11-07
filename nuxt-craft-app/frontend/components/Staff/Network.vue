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
    copy3: {
        type: String,
        default: ''
    },
    images: {
        type: Array,
        default: () => []
    },
    images2: {
        type: Array,
        default: () => []
    },
    list: {
        type: Array,
        default: () => []
    }
    
})
// count the number of images
const imageCount = computed(() => {
    return props.images?.length || 0;
});
</script>
<template>
    <section class="inclusion">
        <div class="animation-start-top inclusion__images" data-scrollspy="animation-start-top">
            <NuxtImg
                v-for="(item, index)  in images" :key="item.id"
                :src="item.image[0].url" 
                :alt="item.image[0].alt || item.title"
                loading="lazy"
                :class="`image--${index + 1}`"
            />
        </div>
        <div class="container">
            <div class="card card--primary">
                <h3>{{ subTitle }}</h3>
                <h4>{{ copy }}</h4>
                <p>{{ copy2 }}</p>
                <ul class="card__list">                                                                                 
                    <li class="card__item" v-for="item in list" :key="item.id"><strong class="item__title">{{ item.title }}</strong>
                        <p class="item__desc">{{ item.caption }}</p>
                    </li>
                </ul>
                <p style="white-space: break-spaces">{{ copy3 }}</p>
            </div>
            </div>
            <div class="animation-start-bottom inclusion__images" data-scrollspy="animation-start-bottom">
                <NuxtImg
                    v-for="(item, index) in images2" :key="item.id"
                    :src="item.image[0].url" 
                    :alt="item.image[0].alt || item.title"
                    loading="lazy"
                    :class="`image--${imageCount+ index + 1}`"
                />
            </div>
    </section>
</template>