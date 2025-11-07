<script setup>
const props = defineProps({
    history: {
        type: Array,
        default: () => []
    }
})

// Base delay time in milliseconds (500ms)
const BASE_DELAY = 500;
</script>
<template>
    <section class="section about">
        <div class="container" >
                <NuxtImg
                    v-for="(item, index) in history" :key="item.id"
                    :src="item.image[0].url" 
                    :alt="item.image[0].alt || item.title"
                    loading="lazy"
                    class="about__img"
                    data-scrollspy="animate__fadeInUp"
                    :data-delay-time="index - 1 * BASE_DELAY"
                />
                <div class="about__text" data-scrollspy="animate__fadeInUp" v-for="(item, index) in history" :key="item.id" :data-delay-time="index * BASE_DELAY">
                    <h3>{{ item.title }}</h3>
                    <h4>{{ item.caption }}</h4>
                    <p>{{ item.copy }}</p>
                </div>
        </div>
    </section>
</template>