<script setup>
import Wheretonext from '../components/wheretonext.vue';

const globalsData = inject('globalsData')
const footerData = inject('footerData')
const footer2Data = inject('footer2Data')
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
    <Footer 
    :globalData="globalsData?.global"
    :footerData="footerData"
    :footer2Data="footer2Data"
    />
  </div>
</template>