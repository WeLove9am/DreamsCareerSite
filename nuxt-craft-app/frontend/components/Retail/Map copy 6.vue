<script setup>
import { onMounted } from 'vue'

const props = defineProps({
  jobs: {
    type: Array,
    default: () => []
  }
})

const { jobs } = props
const config = useRuntimeConfig()
const GOOGLE_MAPS_API_KEY = config.public.googleMapsApiKey

async function initMap() {
  try {
    // Load Google Maps JS only once
    if (!window.google || !window.google.maps) {
      await new Promise((resolve, reject) => {
        const existingScript = document.getElementById('google-maps-script')
        if (existingScript) existingScript.remove()

        const script = document.createElement('script')
        script.id = 'google-maps-script'
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&v=weekly`
        script.async = true
        script.defer = true
        script.onload = resolve
        script.onerror = reject
        document.head.appendChild(script)
      })
    }

    // ✅ Load from the correct library
    const { Map, InfoWindow } = await google.maps.importLibrary('maps')
    const { Marker } = await google.maps.importLibrary('marker')

    if (!jobs.length) {
      console.warn('No job data available for map markers.')
      return
    }

    const map = new Map(document.getElementById('map'), {
      //center: { lat: 54.406847, lng: -1.480041 },
      center: { lat: 54.406847, lng: 1.480041 },
      //lat: 53.0, lng: -1.5
      zoom: 6.5,
      mapId: 'UK_JOBS_MAP',
      //disableDefaultUI: true,
      mapTypeControl: true,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
      position: google.maps.ControlPosition.TOP_CENTER,
    },
    })

    const bounds = new google.maps.LatLngBounds()

    jobs.forEach(job => {
      if (!job.postcodesCat || !job.postcodesCat.length) return
      const { latitude, longitude } = job.postcodesCat[0] || {}
      if (!latitude || !longitude) return

      const lat = parseFloat(latitude)
      const lng = parseFloat(longitude)
      if (isNaN(lat) || isNaN(lng)) return

      const position = { lat, lng }
      console.log('--- Postcode ---', job.postCode);
      console.log('--- Marker Position ---', latitude, longitude);

      const marker = new Marker({
        position,
        map,
        title: job.title
      })

      const infoWindow = new InfoWindow({
        content: `
          <div style="font-size:14px; line-height:1.4">
            <strong>${job.title}</strong><br>
            ${job.location || ''}<br>
            ${job.postCode || ''}
          </div>
        `
      })

      marker.addListener('click', () => infoWindow.open({ anchor: marker, map }))

      bounds.extend(position)
    })

    // if (!bounds.isEmpty()) {
    //   map.fitBounds(bounds)
    // }

    // Slightly shift center left (west)
    const currentCenter = map.getCenter()
    const newCenter = {
      lat: currentCenter.lat(),
      lng: currentCenter.lng() - 0.1
    }
    map.setCenter(newCenter)

  } catch (error) {
    console.error('Google Maps failed to load:', error)
  }
}

onMounted(() => {
  initMap()
})
</script>

<template>
  <section class="section map">
    <div class="map__image wave-top wave-bottom">
      <div id="map" style="width: 100%; border-radius: 12px;"></div>
    </div>

    <div class="map__inner">
      <div class="map__card">
        <div class="card card--primary">
          <h3>Over 200 stores nationwide</h3>
          <h4>
            At Dreams, our retail stores are much more than showrooms—they’re where we turn the art of restful sleep into a joyful, friendly experience.
          </h4>
          <p>
            Our regional stores are dynamic hubs that welcome a diverse range of roles—from Retail Sales Assistants who guide customers to their dream bed using our unique Sleepmatch technology, to our Retail Store Managers who lead their teams and deliver exceptional customer experiences.
          </p>
          <form action="" method="post">
            <div class="control">
              <input class="input input--round" type="search" name="store" placeholder="Find your local store">
              <button class="input__icon" type="submit">
                <svg>
                  <use xlink:href="~/assets/images/sprites.svg#search"></use>
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
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
  /* margin-top: -100px; */
}
</style>
