<script setup>
import { onMounted } from 'vue'
const props = defineProps({
    jobs: {
        type: Array,
        default: () => []
    }
})

const { jobs } = props;
//console.log('--- Map Markers Data Map.vue---', JSON.stringify(props.jobs, null, 2));
// const jobs = JSON.stringify(props.jobs, null, 2);
// console.log('--- Jobs Props Data Map.vue---', jobs);


// Access the Google Maps API key
const config = useRuntimeConfig();
const GOOGLE_MAPS_API_KEY = config.public.googleMapsApiKey;
// const jobs = [
//   {
//     title: "Retail Store Manager",
//     uri: "jobs/retail-store-manager-7",
//     location: "Worcester",
//     postCode: "WR1 2DZ",
//     postcodesCat: [{ longitude: "-2.215466", latitude: "52.194992" }]
//   },
//   {
//     title: "Retail Sales Assistant",
//     uri: "jobs/retail-sales-assistant-28",
//     location: "Shrewsbury",
//     postCode: "SY1 4YA",
//     postcodesCat: [{ longitude: "-2.719052", latitude: "52.738403" }]
//   },
//   {
//     title: "HR Business Partner",
//     uri: "jobs/hr-business-partner",
//     location: "Field Based",
//     postCode: "HP10 9YU",
//     postcodesCat: [{ longitude: "-0.694426", latitude: "51.605299" }]
//   },
//   {
//     title: "Delivery Driver",
//     uri: "jobs/delivery-driver-6",
//     location: "High Wycombe",
//     postCode: "HP10 9QY",
//     postcodesCat: [{ longitude: "-0.696374", latitude: "51.604844" }]
//   }
// ]

// Initialize map after script load
function initMap() {
  const map = new google.maps.Map(document.getElementById('map'), {
    //center: { lat: 52.3555, lng: -1.1743 },
    //center: { lat: 52.582031, lng: 2.158448 },
    center: { lat: 54.406847, lng: 1.480041 },
    zoom: 6,
    mapId: 'UK_JOBS_MAP',
    disableDefaultUI: true,
  })

  const bounds = new google.maps.LatLngBounds()

  jobs.forEach(job => {
  //props.jobs.forEach(job => {

    const lat = parseFloat(job.postcodesCat[0].latitude)
    const lng = parseFloat(job.postcodesCat[0].longitude)
    const position = { lat, lng }

    console.log('--- Marker Position ---', job.postcodesCat[0].latitude, job.postcodesCat[0].longitude);

    const marker = new google.maps.Marker({
      position,
      map,
      title: job.title
    })

    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div style="font-size:14px; line-height:1.4">
          <strong>${job.title}</strong><br>
          ${job.location}<br>
          ${job.postCode}
        </div>
      `
    })

    marker.addListener('click', () => {
      infoWindow.open(map, marker)
    })

    bounds.extend(position)
  })

  // Fit map to markers
  //map.fitBounds(bounds)

  // Shift map center slightly left (west)
//   const currentCenter = map.getCenter()
//   const newCenter = {
//     lat: currentCenter.lat(),
//     lng: currentCenter.lng() - 0.5
//   }
//   map.setCenter(newCenter)
}

onMounted(() => {
  // Always reload script to ensure fresh initialization on full page reload
  const existingScript = document.getElementById('google-maps-script')
  if (existingScript) {
    existingScript.remove()
  }

  const script = document.createElement('script')
  script.id = 'google-maps-script'
  script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&callback=initMap&defer`
  script.async = true
  script.defer = true
  document.head.appendChild(script)

  // Expose initMap globally
  window.initMap = initMap
})
</script>

<template>
  <section class="section map">
    <div class="map__image wave-top wave-bottom">
        <div id="map" style="width: 100%;border-radius: 12px;"></div>
    </div>
    <div class="map__inner">
        <div class="map__card">
            <div class="card card--primary">
                <h3>Over 200 stores nationwide</h3>
                <h4>At Dreams, our retail stores are much more than showrooms—they’re where we turn the art of restful sleep into a joyful, friendly experience. Our network of stores truly stretches from Aberdeen to Truro.</h4>
                <p>Our regional stores are dynamic hubs that welcome a diverse range of roles, From Retail Sales Assistants who guide customers to their dream bed using our unique Sleepmatch technology, creating a memorable and personalised experience. To our Retail Store Managers who lead their in store team, deliver exceptional customer experiences.</p>
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
.wave-top::before{ z-index: 1;}
</style>