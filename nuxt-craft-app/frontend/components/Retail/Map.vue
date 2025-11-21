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
let markers = []
const searchInput = ref(null)
const errorMessage = ref('')

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

async function initMap() {
  try {
    // Load Google Maps script
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

    const { Map, InfoWindow } = await google.maps.importLibrary('maps')
    const { Marker } = await google.maps.importLibrary('marker')

    if (!jobs.length) {
      console.warn('No job data available for map markers.')
      return
    }

    map = new Map(document.getElementById('map'), {
      center: { lat: 54.406847, lng: 1.480041 },
      zoom: 6.5,
      mapId: 'UK_JOBS_MAP',
      // mapTypeControl: true,
      // mapTypeControlOptions: {
      //   style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
      //   position: google.maps.ControlPosition.TOP_CENTER,
      // },
      fullscreenControl: false,
      mapTypeControl: false,
      streetViewControl: false,
      zoomControl: false,
      rotateControl: false,
      scaleControl: false,
      keyboardShortcuts: false,
      clickableIcons: false,
    })

    // Add markers
    jobs.forEach(job => {
      if (!job.postcodesCat || !job.postcodesCat.length) return
      const { latitude, longitude } = job.postcodesCat[0] || {}
      if (!latitude || !longitude) return

      const lat = parseFloat(latitude)
      const lng = parseFloat(longitude)
      if (isNaN(lat) || isNaN(lng)) return

      const position = { lat, lng }
      // const marker = new Marker({
      //   position,
      //   map,
      //   title: job.title,
      //   icon: {
      //     path: google.maps.SymbolPath.CIRCLE,
      //     scale: 10,                 // outer circle size
      //     fillColor: "#251163",      // outer circle
      //     fillOpacity: 1,
      //     strokeWeight: 3,           
      //     strokeColor: "#dba5ba",    // inner “dot” border color
      //   },
      // })
      const marker = new Marker({
        position,
        map,
        title: job.title
      })


      const infoWindow = new InfoWindow({
      content: `
        <div style="font-size:14px; line-height:1.4">
          <strong>${job.title}</strong><br>
          ${job.locationName || ''}<br>
          ${job.postCode || ''}<br>
          <a href="/${job.uri}/${job.jobId}" target="_blank" style="color:#251163; text-decoration:underline;">
            View Job →
          </a>
        </div>
      `
    })


      marker.addListener('click', () => infoWindow.open({ anchor: marker, map }))
      markers.push({ marker, job, position })
    })

    const newCenter = {
      lat: 54.622978, 
      lng: -2.592773
    }
    map.setCenter(newCenter)

  } catch (error) {
    console.error('Google Maps failed to load:', error)
  }
}

// Search and Filter Jobs by Location
async function handleSearch(e) {
  e.preventDefault()
  errorMessage.value = '' // reset previous message
  const query = searchInput.value.value.trim()
  if(query.length < 3) {
    errorMessage.value = 'Please enter at least 3 characters.'
    return
  }

  try {
    const res = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_ACCESS_TOKEN}&country=GB&limit=1`)
    const data = await res.json()
    if (!data.features || !data.features.length) {
      errorMessage.value = 'No locations found for that search.'
      return
    }

    const [lng, lat] = data.features[0].center
    const searchLocation = { lat, lng }

    // Filter jobs within 50 miles
    const nearby = markers.filter(m => {
      const dist = haversineDistance(searchLocation, m.position)
      return dist <= 50
    })

    if (!nearby.length) {
      //alert('No jobs found within 50 miles of that location.')
      errorMessage.value = 'No jobs found within 50 miles of that location.'
      return
    }

    // Hide all markers first
    markers.forEach(m => m.marker.setMap(null))

    // Show only nearby markers
    nearby.forEach(m => m.marker.setMap(map))

    // Center map around search location
    map.setCenter(searchLocation)
    map.setZoom(8)


  } catch (err) {
    console.error('Error fetching geocode:', err)
    //alert('Error searching location.')
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
