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
  }
})

</script>

<template>

<section class="section">
    <div class="next">
        <div class="next__inner">
            <div class="next__body">
                <h3>{{ globalData.subTitle }}</h3>
                <h4>{{ globalData.caption }}</h4>
                <p>{{ globalData.copy }}</p>
                <div class="next__actions">
                    <a v-for="link in globalData.links" :key="link.id"
                            class="button button--primary" 
                            :href="link.pageLink.startsWith('/') ? link.pageLink : `/${link.pageLink}`">
                            {{ link.title }}
                    </a>
                </div>
            </div>
            <NuxtImg
                v-if="globalData.image?.[0]?.url" 
                :src="globalData.image[0].url" 
                :alt="globalData.image[0].alt || globalData.subTitle"
                loading="lazy"
                width="393px" height="333px"
            />
        </div>
    </div>
</section>


</template>
