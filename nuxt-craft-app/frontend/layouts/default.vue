<script setup>
import Wheretonext from '../components/wheretonext.vue';

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
    <main class="main">
      <slot />
      <Wheretonext :globalData="globalsData?.global"/>
    </main>
    <Footer :globalData="globalsData?.global"/>
  </div>
</template>