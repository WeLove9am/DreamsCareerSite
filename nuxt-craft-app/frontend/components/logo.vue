<script setup>
const props = defineProps({
  siteName: {
    type: String,
    required: true,
    default: 'Site Name'
  },
  logo: {
    type: Object,
    required: false,
    default: () => ({
      url: '',
      alt: ''
    })
  }
});
</script>

<template>
  <a href="/" class="header__logo">
    <template v-if="logo.length > 0">
      <img 
        :src="logo[0].url" 
        :alt="logo[0].alt" 
        class="w-10 h-10" width="187" height="67"
      />
    </template>
    <template v-else>
      {{ siteName }}
    </template>
  </a>
</template>
