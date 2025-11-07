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
    }
})

</script>
<template>
    <section class="page-header">
        <div class="container" data-scrollspy="animate__fadeInUp">
            <h2>{{ subHeading }}</h2>
            <h3>{{ subHeading2 }}</h3>
            <h4>{{ caption }}</h4>
        </div>
    </section>
</template>