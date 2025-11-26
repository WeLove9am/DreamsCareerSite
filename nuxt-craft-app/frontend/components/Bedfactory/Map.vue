<script setup>
import { onMounted } from 'vue'

const props = defineProps({
  
  subTitle: {
    type: String,
    default: ''
  },
  copy: {
    type: String,
    default: ''
  },
  copy2: {
    type: String,
    default: ''
  }

})

const config = useRuntimeConfig()
const GOOGLE_MAPS_API_KEY = config.public.googleMapsApiKey

// Fixed location (from your iframe)
const FIXED_POS = { lat: 52.497128, lng: -2.018146 }
//51.605439,-0.694342

async function initMap() {
  try {
    // load script once if needed
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

    // Use new importLibrary API
    const { Map } = await google.maps.importLibrary('maps')
    const { Marker } = await google.maps.importLibrary('marker')

    // map options: no controls and non-interactive
    const map = new Map(document.getElementById('map'), {
      center: FIXED_POS,
      zoom: 18,
      mapId: undefined,            // or your map style id
      disableDefaultUI: true,      // hide default controls
      clickableIcons: false,
      gestureHandling: 'none',     // disables drag/scroll/zoom gestures
      draggable: false,
      keyboardShortcuts: false,
      fullscreenControl: false,
      zoomControl: false,
      mapTypeControl: false,
      streetViewControl: false,
      disableDoubleClickZoom: true
    })

    // single marker
    new Marker({
      position: FIXED_POS,
      map,
      title: 'Dreams Head Office High Wycombe'
    })

    // if you want the map non-interactive but still zoomable programmatically,
    // remove gestureHandling:'none' and set draggable:false etc.
  } catch (err) {
    // keep error handling simple
    // (console to help debugging; will not show UI)
    // eslint-disable-next-line no-console
    console.error('Google Maps failed to load:', err)
  }
}

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
                            <p>{{ copy2 }}</p>
                        </div>
                    </div>
                </div>
            </section>


</template>

<style scoped>
/* if you ever want to hide pointer cursor or selection */
#map {
  cursor: default;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.map__image #map {
  height: 640px;
}
@media (min-width: 768px) {
  .map__image #map {
    height: 900px;
  }
}
@media (min-width: 1600px) {
  .map__image #map {
    height: 1240px;
  }
}
.wave-top::before {
  z-index: 1;
}
.section.map .map__inner {
  z-index: 2;
}
</style>
