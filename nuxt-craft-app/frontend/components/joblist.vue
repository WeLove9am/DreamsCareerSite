<script setup>
const props = defineProps({
  entry: {
    type: Object,
    required: true
  }
  // ,
  // featured: {
  //   type: Boolean,
  //   default: false
  // }
});
</script>

<template>
  <article class="py-6 mb-12">
    
    <div class="mb-4">
      <h2 class="font-bold mb-2 text-4xl">
        <a 
          :href="`/${entry.uri}`" 
          class="text-red-600 hover:underline focus:underline cursor-pointer"
        >
          {{ entry.title }}
      </a>
      </h2>
      <p v-if="entry.pageSubheading">{{ entry.jobDescription }}</p>
      <p>
        <time class="text-sm" :datetime="entry.postDate">{{ entry.postDate }}</time>
      </p>
    </div>
  </article>
</template>
