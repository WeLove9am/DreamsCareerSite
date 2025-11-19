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
    subHeading2: {
        type: String,
        default: ''
    },
    wellbeing: {
        type: Array,
        default: () => []
    }
    
})
</script>
<template>
    <section class="section">
                <div class="container">
                    <div class="section-header">
                        <h2 v-if="subHeading">{{ subHeading }}</h2>
                        <h3 v-if="subHeading2">{{ subHeading2 }}</h3>
                        <h4 v-if="subHeadin3">{{ subHeading3 }}</h4>
                    </div>
                    <div class="wellbeing" data-scrollspy="animate__stackCardsDown">
                        <div class="wellbeing__background wave-top wave-bottom"></div>
                        <div class="wellbeing__card" v-for="item  in wellbeing" :key="item.id">
                            <NuxtImg
                                    v-if="item.image?.[0]?.url" 
                                    :src="item.image[0].url" 
                                    :alt="item.image[0].alt || item.title"
                                    loading="lazy"
                                />
                            <div class="wellbeing__card-body">
                                <h3 v-if="item.title">{{ item.title }}</h3>
                                <h4 v-if="item.subTitle">{{ item.subTitle }}</h4>
                                <ul v-if="item.list.length">
                                    <li v-for="subitem in item.list" :key="subitem.id"><b>{{ subitem.title }}</b>{{ subitem.caption }}</li>
                                </ul>
                                <p v-if="item.copy">{{ item.copy }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
</template>