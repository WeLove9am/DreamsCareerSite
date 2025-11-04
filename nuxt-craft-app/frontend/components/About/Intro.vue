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
    caption: {
        type: String,
        default: ''
    },
    caption2: {
        type: String,
        default: ''
    }
})

</script>
<template>
    <section class="section page-header">
        <div class="container" data-scrollspy="animate__fadeInUp">
            <h2>{{ subHeading }}</h2>
            <h3>{{ subHeading2 }}</h3>
            <h4>{{ caption }}</h4>
            <p>{{ caption2 }}</p>
        </div>
    </section>
</template>