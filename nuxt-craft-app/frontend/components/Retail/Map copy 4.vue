<template>
  <GoogleMap
    api-key="AIzaSyDogx26BI-gW6eYFAaJsyYjWIbV1CuAT_s"
    style="width: 100%; height: 400px"
    :center="center"
    :zoom="15"
  >
    <Marker :options="{ position: center }" />
  </GoogleMap>
</template>

<script setup>
// Manual import
import { GoogleMap, Marker } from 'vue3-google-map'

const center = { lat: 40.689247, lng: -74.044502 }
</script>