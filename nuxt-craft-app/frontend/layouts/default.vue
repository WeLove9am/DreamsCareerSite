<script setup>
const globalsData = inject('globalsData')
</script>

<template>
  <div>
    <Header 
      :globalData="globalsData?.global" 
      :pages="globalsData?.pages"
      :headernav="globalsData?.headernav"
    />
    <Alert />
    <main class="page min-h-screen" id="main" tabindex="-1">
      <slot />
    </main>
    <Footer :globalData="globalsData?.global" />
  </div>
</template>