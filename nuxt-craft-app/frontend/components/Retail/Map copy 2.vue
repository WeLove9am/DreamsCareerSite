<script setup>
import { GoogleMap, InfoWindow, AdvancedMarker } from 'vue3-google-map';
import { useRuntimeConfig } from '#app';
import { ref, computed } from 'vue';

// 1. Define Props (Receives the transformed job data)
const props = defineProps({
  markers: {
    type: Array,
    required: true,
    default: () => []
  }
});

// Access the Google Maps API key
const config = useRuntimeConfig();
const apiKey = config.public.googleMapsApiKey;

// State for InfoWindow management
const openInfoWindowId = ref(null);

// 2. Map Configuration (Center)
// Calculate the center based on the markers, or use a default UK center
const mapCenter = computed(() => {
    if (props.markers.length === 0) {
        return { lat: 53.0, lng: -1.5 }; // Default UK center
    }
    // Simple average center (could be improved with a bounding box calculation)
    const latSum = props.markers.reduce((sum, job) => sum + job.position.lat, 0);
    const lngSum = props.markers.reduce((sum, job) => sum + job.position.lng, 0);
    return { 
        lat: latSum / props.markers.length, 
        lng: lngSum / props.markers.length 
    };
});

const mapOptions = {
    zoom: 6, // Default zoom level
    disableDefaultUI: false,
    // 🎯 FIX: Allows zooming with the mouse wheel without holding Command/Ctrl
    gestureHandling: 'greedy',
};

// 3. Handlers
const handleMarkerClick = (jobId) => {
  // Toggle the info window for the clicked marker
  openInfoWindowId.value = openInfoWindowId.value === jobId ? null : jobId;
};
</script>

<template>
<section class="section map">
  <div class="map-container-wrapper" style="height: 600px; width: 100%;">
    <GoogleMap 
      :api-key="apiKey" 
      :center="mapCenter" 
      :options="mapOptions"
      class="map-container"
    >
      <AdvancedMarker
        v-for="job in markers"
        :key="job.id"
        
        :options="{ position: job.position, title: job.title }"
        @click="handleMarkerClick(job.id)"
      >
        <InfoWindow 
          v-if="openInfoWindowId === job.id" 
          :options="{ maxWidth: 200 }"
          @closeclick="openInfoWindowId = null"
        >
          <div class="job-info">
            <strong>{{ job.title }}</strong>
            <p>{{ job.locationName }}</p>
            <NuxtLink :to="`/${job.uri}`">View Details</NuxtLink>
          </div>
        </InfoWindow>
      </AdvancedMarker>
    </GoogleMap>
  </div>
  </section>
</template>

<style scoped>
/* Basic styling to ensure the map renders */
.map-container {
    height: 100%;
    width: 100%;
}
</style>