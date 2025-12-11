<template>
  <div class="iframe-shell">
    <iframe src="https://stagingdreams.amris-wizard-proxy.com/login" title="Login"></iframe>
  </div>
</template>

<style scoped>
.iframe-shell {
  height: 100vh;            /* fills screen */
  overflow: hidden;         /* hides iframe overflow */
}
.iframe-shell iframe {
  width: 100%;
  height: 100%;
  border: 0;
}
.page-wrapper,
body {
  overflow-y: auto; /* allow page scroll */
}
</style>
<script setup>
definePageMeta({ layout: 'iframe', ssr: false})
</script>