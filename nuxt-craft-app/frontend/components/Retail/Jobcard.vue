<script setup>
const props = defineProps({
  jobs: {
    type: Array,
    default: () => []
  },
  subTitle: {
    type: String,
    default: ''
}
})
const truncate = (text, len) => (text ? text.slice(0, len) + '...' : '')
</script>
<template>
                <section class="section">
                <div class="container">
                    <div class="section-header">
                        <h2>{{ subTitle }}</h2>
                    </div>
                </div>
                <div class="slider-jobs-wrapper">
                    <div class="swiper slider-jobs">
                        <div class="swiper-wrapper">
                            <div class="swiper-slide" v-for="job in jobs" :key="job.id">
                                <article class="card-job"><span class="card-job__category">{{ job.sector[0]?.title || 'N/A' }}</span>
                                    <h3>{{ job.title }}</h3>
                                    <p v-html="truncate(job.jobDescription, 100)"></p>
                                    <div class="card-job__details">
                                        <ul class="card-job__detail-list">
                                            <li><span class="card-job__detail-label">Contract type:</span><span class="card-job__detail-value">{{ job.contractType[0]?.title || 'N/A' }}</span></li>
                                            <li><span class="card-job__detail-label">Contract hours:</span><span class="card-job__detail-value">{{ job.contractHours[0]?.title || 'N/A' }}</span></li>
                                            <li><span class="card-job__detail-label">Location:</span><span class="card-job__detail-value">{{ job.location }}, {{ job.postCode }}</span></li>
                                            <li><span class="card-job__detail-label">Salary:</span><span class="card-job__detail-value">{{ job.salary }}</span></li>
                                        </ul>
                                    </div>
                                    <!--<h5>Perfect for:</h5>
                                    <div class="card-job__traits">
                                        <ul>
                                            <li><span class="card-job__trait">Engaging and positive personalities</span></li>
                                            <li><span class="card-job__trait">No previous experience is necessary</span></li>
                                            <li><span class="card-job__trait">Determined and motivated</span></li>
                                        </ul>
                                    </div>-->
                                </article>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </section>

</template>