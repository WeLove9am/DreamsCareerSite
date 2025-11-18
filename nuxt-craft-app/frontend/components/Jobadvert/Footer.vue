<script setup>
const props = defineProps({
  globalData: {
    type: Object,
    default: () => ({
      image: {
        url: '',
        alt: ''
      }
    })
  },
      title: {
        type: String,
        default: ''
    },
    contractType: {
        type: Array,
        default: () => []
    },
    contractHours: {
        type: Array,
        default: () => []
    },
    sector: {
        type: Array,
        default: () => []
    },
    location: {
        type: String,
        default: ''
    },
    postCode: {
        type: String,
        default: ''
    },
    salary: {
        type: String,
        default: ''
    },
    jobDescription: {
        type: String,
        default: ''
    },
    jobLink: {
        type: String,
        default: ''
    }
})
const truncate = (text, len) => (text ? text.slice(0, len) + '...' : '')
</script>

<template>

<section class="section">
    <div class="next">
        <div class="next__inner job_footer">
            <div class="next__body">
                <h3>{{ title }}</h3>
                <h5 v-html="truncate(jobDescription, 300)" class="job_text"></h5>
                <div class="jobs_footer hero__tags">
                  <div class="button button--gray">{{ sector[0]?.title || 'N/A' }}</div>
                  <div class="button button--gray">{{ contractType[0]?.title || 'N/A' }}</div>
                  <div class="button button--gray">{{ contractHours[0]?.title || 'N/A' }}</div>
                  <div class="button button--gray">{{ location }}</div>
                  <div class="button button--gray">{{ salary }}</div>
                </div>
                <div class="next__actions">
                    <a 
                            class="button button--primary" 
                            :href="jobLink">
                            APPLY
                    </a>
                </div>
            </div>
            <NuxtImg
                v-if="globalData.image?.[0]?.url" 
                :src="globalData.image[0].url" 
                :alt="globalData.image[0].alt || globalData.subTitle"
                loading="lazy"
                width="393px" height="333px"
                class="next__image"
            />
        </div>
    </div>
</section>


</template>
