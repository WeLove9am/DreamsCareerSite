<script setup>
const globalsData = inject('globalsData')
</script>

<template>
  <div>
    <Headerhome
      :globalData="globalsData?.global" 
      :pages="globalsData?.pages"
      :headernav="globalsData?.headernav"
    />
    <Alert />
    <main class="main">
      <slot />
    </main>
    <Footer :globalData="globalsData?.global"/>
  </div>
</template>