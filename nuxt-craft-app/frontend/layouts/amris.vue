<script setup>
const globalsData = inject('globalsData')
const footerData = inject('footerData')
const footer2Data = inject('footer2Data')
</script>

<template>
  <div>
    <Headeramris
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