<script setup>
import { onMounted, ref } from 'vue'

const props = defineProps({
  jobs: {
    type: Array,
    default: () => []
  },
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

const { jobs } = props
const config = useRuntimeConfig()
const GOOGLE_MAPS_API_KEY = config.public.googleMapsApiKey
const MAPBOX_ACCESS_TOKEN = config.public.mapboxAccessToken

let map = null
let markers = [] // each item: { marker, jobs[], position }
const searchInput = ref(null)
const errorMessage = ref('')

// --- Utils ---
function toRadians(deg) {
  return deg * Math.PI / 180
}

function haversineDistance(coord1, coord2) {
  const R = 3958.8 // miles
  const dLat = toRadians(coord2.lat - coord1.lat)
  const dLon = toRadians(coord2.lng - coord1.lng)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(coord1.lat)) * Math.cos(toRadians(coord2.lat)) *
    Math.sin(dLon / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// -----------------------------------------------------------------------------
// INIT MAP
// -----------------------------------------------------------------------------
async function initMap() {
  try {
    // Load Google Maps script
    if (!window.google || !window.google.maps) {
      await new Promise((resolve, reject) => {
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

    const { Map, InfoWindow } = await google.maps.importLibrary('maps')
    const { Marker } = await google.maps.importLibrary('marker')

    // Responsive zoom
    const zoomLevel = window.innerWidth < 768 ? 5.5 : 6.0

    map = new Map(document.getElementById('map'), {
      center: { lat: 54.406847, lng: 1.480041 },
      zoom: zoomLevel,
      mapId: 'UK_JOBS_MAP',
      fullscreenControl: false,
      mapTypeControl: false,
      streetViewControl: false,
      zoomControl: false,
      rotateControl: false,
      scaleControl: false,
      keyboardShortcuts: false,
      clickableIcons: false,
    })

    // -------------------------------------------------------------------------
    // GROUP JOBS BY COORDINATES
    // -------------------------------------------------------------------------
    const grouped = {}

    jobs.forEach(job => {
      if (!job.postcodesCat?.length) return
      const { latitude, longitude } = job.postcodesCat[0]
      if (!latitude || !longitude) return

      const key = `${latitude},${longitude}`
      grouped[key] ||= []
      grouped[key].push(job)
    })

    // -------------------------------------------------------------------------
    // CREATE ONE MARKER PER LOCATION
    // -------------------------------------------------------------------------
    Object.entries(grouped).forEach(([key, jobList]) => {
      const [lat, lng] = key.split(',').map(Number)
      const position = { lat, lng }

      const marker = new Marker({
        position,
        map,
        title: jobList[0].locationName || jobList[0].title
      })

      // Build infoWindow with multiple jobs
      let html = `<div style="font-size:14px; line-height:1.4">`

      jobList.forEach(job => {
        html += `
          <div style="margin-bottom:10px;">
            <strong>${job.title}</strong><br>
            ${job.locationName || ''}<br>
            ${job.postCode || ''}<br>
            <a href="/${job.uri}/${job.jobId}" 
               target="_blank"
               style="color:#251163; text-decoration:underline;">
              View Job →
            </a>
          </div>
          <hr/>
        `
      })

      html += `</div>`

      const infoWindow = new InfoWindow({ content: html })

      marker.addListener('click', () => infoWindow.open({ anchor: marker, map }))

      markers.push({ marker, jobs: jobList, position })
    })

    // Reset map center
    map.setCenter({ lat: 54.622978, lng: -2.592773 })

  } catch (err) {
    console.error('Google Maps failed:', err)
  }
}

// -----------------------------------------------------------------------------
// SEARCH
// -----------------------------------------------------------------------------
async function handleSearch(e) {
  e.preventDefault()
  errorMessage.value = ''

  const query = searchInput.value.value.trim()
  if (query.length < 3) {
    errorMessage.value = 'Please enter at least 3 characters.'
    return
  }

  try {
    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_ACCESS_TOKEN}&country=GB&limit=1`
    )

    const data = await res.json()
    if (!data.features?.length) {
      errorMessage.value = 'No locations found for that search.'
      return
    }

    const [lng, lat] = data.features[0].center
    const searchLoc = { lat, lng }

    // Find markers within 50 miles
    const nearby = markers.filter(m => {
      const dist = haversineDistance(searchLoc, m.position)
      return dist <= 50
    })

    if (!nearby.length) {
      errorMessage.value = 'No jobs found within 50 miles of that location.'
      return
    }

    // Hide all markers
    markers.forEach(m => m.marker.setMap(null))

    // Show matched markers only
    nearby.forEach(m => m.marker.setMap(map))

    map.setCenter(searchLoc)
    map.setZoom(8)

  } catch (err) {
    console.error(err)
    errorMessage.value = 'Error searching location.'
  }
}

onMounted(() => {
  initMap()
})
</script>

<template>
  <section class="section map retail_map">
    <div class="container">
      <div class="map-columns">
        <div id="map" style="width: 100%; border-radius: 20px;"></div>
        <div class="map__card retail-map__card">
          <div class="card card--primary">
            <h3>{{ subTitle }}</h3>
            <h4>{{ copy }}</h4>
            <p>{{ copy2 }}</p>
            <form @submit="handleSearch">
              <div class="control">
                <input
                  ref="searchInput"
                  class="input input--round"
                  type="search"
                  name="store"
                  placeholder="Find your local store"
                />
                <button class="input__icon" type="submit">
                  <svg>
                    <use xlink:href="~/assets/images/sprites.svg#search"></use>
                  </svg>
                </button>
              </div>
              <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
            </form>
          </div>
          </div>
        </div>
    </div>
  </section>
</template>

<style scoped>
.map__image #map {
  min-height: 640px;
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
.error-message {
  color: #ff4d4f;
  font-size: 14px;
  margin-top: 6px;
  margin-left: 6px;
}
/* Hide the native clear ("x") button */
input[type="search"]::-webkit-search-cancel-button {
  -webkit-appearance: none;
  appearance: none;
}

/* Hide the magnifier icon (in Safari) */
input[type="search"]::-webkit-search-decoration {
  -webkit-appearance: none;
  appearance: none;
}

</style>
