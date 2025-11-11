<script setup>
import { onMounted, watch } from 'vue'

const props = defineProps({
  subTitle: { type: String, default: '' },
  copy: { type: String, default: '' },
  address: { type: String, default: '' }, // address string (store fullAddressLine)
  store: { type: String, default: '' },
  postcode: { type: String, default: '' }
})

const config = useRuntimeConfig()
const GOOGLE_MAPS_API_KEY = config.public.googleMapsApiKey

// fallback default (Dreams HQ)
const DEFAULT_POS = { lat: 51.6054387, lng: -0.6943416 }

let map, marker

async function loadGoogleMaps() {
  if (!window.google || !window.google.maps) {
    await new Promise((resolve, reject) => {
      const existing = document.getElementById('google-maps-script')
      if (existing) existing.remove()

      const s = document.createElement('script')
      s.id = 'google-maps-script'
      s.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&v=weekly`
      s.async = true
      s.defer = true
      s.onload = resolve
      s.onerror = reject
      document.head.appendChild(s)
    })
  }
}

async function geocodeAddress(address) {
  try {
    const encoded = encodeURIComponent(address)
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encoded}&key=${GOOGLE_MAPS_API_KEY}`
    const res = await fetch(url)
    const data = await res.json()
    const loc = data?.results?.[0]?.geometry?.location
    return loc ? { lat: loc.lat, lng: loc.lng } : null
  } catch (err) {
    console.error('Geocoding failed:', err)
    return null
  }
}

async function initMap() {
  try {
    await loadGoogleMaps()
    const { Map } = await google.maps.importLibrary('maps')
    const { Marker } = await google.maps.importLibrary('marker')

    map = new Map(document.getElementById('map'), {
      center: DEFAULT_POS,
      zoom: 16,
      disableDefaultUI: true,
      clickableIcons: false,
      gestureHandling: 'none',
      draggable: false,
      keyboardShortcuts: false,
      fullscreenControl: false,
      zoomControl: false,
      mapTypeControl: false,
      streetViewControl: false,
      disableDoubleClickZoom: true
    })

    marker = new Marker({
      position: DEFAULT_POS,
      map,
      title: props.address || 'Dreams Head Office'
    })

    // 1. Define Offset Constants
    const DESKTOP_LNG_OFFSET = 0.005;  // Shifts map left (West) to make space on the right
    const MOBILE_LAT_OFFSET = 0.001;   // Shifts map up (North) to make space below

    const MOBILE_BREAKPOINT = 768;     // Standard mobile breakpoint in pixels

    // If address is available, update map center
    if (props.address) {
      const loc = await geocodeAddress(props.address + (props.postcode ? ', ' + props.postcode : ''))
      
      if (loc) {
        let finalLat = loc.lat;
        let finalLng = loc.lng;

        // --- Apply Desktop Horizontal Offset ---
        if (window.innerWidth > MOBILE_BREAKPOINT) {
          // Apply horizontal shift (moves map left, marker appears right)
          finalLng += DESKTOP_LNG_OFFSET; 
        } 
        
        // --- Apply Mobile Vertical Offset ---
        else {
          // Apply vertical shift (moves map up, marker appears lower)
          finalLat += MOBILE_LAT_OFFSET; 
        }
        
        // 2. Calculate the Map Center
        const shiftedCenter = {
          lat: finalLat,
          lng: finalLng
        };
        
        // 3. Set the map's view to the shifted center
        map.setCenter(shiftedCenter);
        
        // 4. Keep the marker exactly at the true geocoded position
        marker.setPosition(loc);
      }
    }

    
  } catch (err) {
    console.error('Google Maps failed to load:', err)
  }
  
}

// Re-geocode if address changes
watch(() => props.address, async (newAddress) => {
  if (newAddress && map && marker) {
    const loc = await geocodeAddress(newAddress)
    if (loc) {
      map.setCenter(loc)
      marker.setPosition(loc)
    }
  }
})

onMounted(() => {
  initMap()
})
</script>

<template>
  <section class="section map">
    <div class="map__image wave-top wave-bottom">
      <div id="map" style="width:100%; border-radius:8px; overflow:hidden;"></div>
    </div>
    <div class="map__inner">
      <div class="map__card">
        <div class="card card--primary">
          <h3>{{ subTitle }}</h3>
          <h4>{{ copy }}</h4>
          <address><b v-if="store">Dreams {{ store }}</b>
                    <template v-if="address">
                      <p v-for="(line, i) in address.split(',')" :key="i">
                        {{ line.trim() }}
                      </p>
                    </template>
                    <p v-if="postcode">{{ postcode }}</p>
          </address>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
#map {
  cursor: default;
  user-select: none;
}
.map__image #map {
  height: 640px;
}
@media (min-width: 768px) {
  .map__image #map { height: 900px; }
}
@media (min-width: 1600px) {
  .map__image #map { height: 1240px; }
}
.wave-top::before { z-index: 1; }
.section.map .map__inner { z-index: 2; }
</style>
