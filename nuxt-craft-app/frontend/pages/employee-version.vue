<script setup>
import { SOCIAL_GRAPHIC_GENERATOR_QUERY } from '@/queries/socialGraphicGeneratorEV.mjs'
import { useGraphQL } from '@/composables/useGraphQL'
import { usePreview } from '@/composables/usePreview'

definePageMeta({
  layout: 'application',
})

const graphql = useGraphQL()
const { previewToken } = usePreview()

const { data } = await useAsyncData(
  'social-graphic-generator-ev',
  async () => {
    const result = await graphql.query(SOCIAL_GRAPHIC_GENERATOR_QUERY, {}, {
      previewToken: previewToken.value,
    })

    if (!result?.entry) {
      throw createError({
        statusCode: 404,
        message: 'Employee version social graphic generator page not found',
      })
    }

    return {
      page: result.entry,
      global: result.globalEntries?.[0] || {},
    }
  },
  {
    watch: [previewToken],
  },
)

const page = computed(() => data.value?.page || {})
const global = computed(() => data.value?.global || {})

const brandedGraphics = computed(() =>
  (page.value.images || []).flatMap((item) => {
    const asset = item?.image?.[0]

    if (!asset?.url) {
      return []
    }

    return [{
      id: String(item.id || asset.url),
      title: item.title || asset.alt || 'Branded graphic',
      url: asset.url,
      previewUrl: `/api/social-graphic-image?url=${encodeURIComponent(asset.url)}`,
      alt: asset.alt || item.title || 'Branded graphic',
      photoBox: { x: 125, y: 100, w: 340, h: 340 },
    }]
  }),
)

const canvas = ref(null)
const fileInput = ref(null)
const uploadedImage = shallowRef(null)
const uploadedFileName = ref('image')
const displayedFileName = ref('No file chosen')
const selectedGraphic = ref(null)
const previewError = ref('')
const frameCache = new Map()

const canDownload = computed(() => Boolean(selectedGraphic.value && uploadedImage.value))

const sharingImage = computed(() =>
  page.value.sharingImage?.[0]?.url || global.value.sharingImage?.[0]?.url,
)

useHead(() => ({
  title: page.value.metaTitle || page.value.title || 'Employee Version',
  meta: [
    {
      name: 'description',
      content: page.value.metaDescription || global.value.metaDescription,
    },
    {
      property: 'og:title',
      content: page.value.sharingTitle || page.value.metaTitle || page.value.title,
    },
    {
      property: 'og:description',
      content: page.value.sharingDescription || page.value.metaDescription || global.value.sharingDescription,
    },
    ...(sharingImage.value ? [{ property: 'og:image', content: sharingImage.value }] : []),
    { name: 'twitter:card', content: 'summary_large_image' },
    ...(sharingImage.value ? [{ name: 'twitter:image', content: sharingImage.value }] : []),
    {
      name: 'robots',
      content: page.value.defaultRobots !== 'siteDefault'
        ? page.value.defaultRobots
        : global.value.defaultRobots,
    },
  ].filter((meta) => meta.content),
}))

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error(`Unable to load image: ${url}`))
    image.src = url
  })
}

async function getFrameImage(graphic) {
  if (!frameCache.has(graphic.previewUrl)) {
    frameCache.set(graphic.previewUrl, loadImage(graphic.previewUrl))
  }

  return frameCache.get(graphic.previewUrl)
}

function drawImageCover(context, image, x, y, width, height) {
  const imageWidth = image.naturalWidth
  const imageHeight = image.naturalHeight

  if (!imageWidth || !imageHeight) {
    return
  }

  const scale = Math.max(width / imageWidth, height / imageHeight)
  const sourceWidth = width / scale
  const sourceHeight = height / scale
  const sourceX = (imageWidth - sourceWidth) / 2
  const sourceY = (imageHeight - sourceHeight) / 2

  context.save()
  context.beginPath()
  context.rect(x, y, width, height)
  context.clip()
  context.drawImage(
    image,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    x,
    y,
    width,
    height,
  )
  context.restore()
}

async function renderPreview() {
  if (!canvas.value) {
    return
  }

  const context = canvas.value.getContext('2d')
  const width = canvas.value.width
  const height = canvas.value.height
  context.clearRect(0, 0, width, height)
  previewError.value = ''

  if (!selectedGraphic.value) {
    return
  }

  try {
    const frame = await getFrameImage(selectedGraphic.value)
    drawImageCover(context, frame, 0, 0, width, height)

    const box = selectedGraphic.value.photoBox
    if (uploadedImage.value) {
      drawImageCover(context, uploadedImage.value, box.x, box.y, box.w, box.h)
    } else {
      context.fillStyle = '#e8e8e8'
      context.fillRect(box.x, box.y, box.w, box.h)
      context.fillStyle = '#777'
      context.font = '500 18px Axiforma, sans-serif'
      context.textAlign = 'center'
      context.textBaseline = 'middle'
      context.fillText('Your photo here', box.x + box.w / 2, box.y + box.h / 2)
    }
  } catch (error) {
    console.error('Failed to render the social graphic preview:', error)
    previewError.value = 'This graphic could not be loaded. Please choose another one.'
  }
}

async function selectGraphic(graphic) {
  selectedGraphic.value = graphic
  await renderPreview()
}

function handleFileChange(event) {
  const file = event.target.files?.[0]
  if (!file) {
    return
  }

  uploadedFileName.value = file.name.replace(/\.[^.]+$/, '') || 'image'
  displayedFileName.value = file.name

  const reader = new FileReader()
  reader.onload = ({ target }) => {
    const image = new Image()
    image.onload = async () => {
      uploadedImage.value = image
      await renderPreview()
    }
    image.src = target.result
  }
  reader.readAsDataURL(file)
}

async function removeUploadedImage() {
  uploadedImage.value = null
  uploadedFileName.value = 'image'
  displayedFileName.value = 'No file chosen'

  if (fileInput.value) {
    fileInput.value.value = ''
  }

  await renderPreview()
}

async function downloadGraphic() {
  if (!canDownload.value) {
    return
  }

  try {
    const output = document.createElement('canvas')
    output.width = 590
    output.height = 590
    const context = output.getContext('2d')
    const frame = await getFrameImage(selectedGraphic.value)

    drawImageCover(context, frame, 0, 0, output.width, output.height)

    const box = selectedGraphic.value.photoBox
    drawImageCover(context, uploadedImage.value, box.x, box.y, box.w, box.h)

    output.toBlob((blob) => {
      if (!blob) {
        return
      }

      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${uploadedFileName.value}-employee-version-social-graphic.jpg`
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)
    }, 'image/jpeg', 0.92)
  } catch (error) {
    console.error('Failed to download the social graphic:', error)
    previewError.value = 'The download could not be created. Please try again.'
  }
}

onBeforeUnmount(() => {
  frameCache.clear()
})
</script>

<template>
  <div class="sgn-page-wrapper">
    <div class="container">
      <header class="sgn-page-header">
        <h1 class="sgn-page-title">Employee Version Social Graphic Generator</h1>
        <p class="sgn-page-subtitle">
          Upload your image, choose a branded graphic, and create your personalised social post
        </p>
      </header>

      <section id="sgn-section-upload" class="sgn-card">
        <h2 class="sgn-section-title">1. Upload Your Image</h2>
        <p class="sgn-section-subtitle">Upload a clear headshot or photo of yourself.</p>
        <div class="sgn-upload-area">
          <label class="sgn-file-input-wrapper" for="sgn-employee-version-image-upload">
            <span class="sgn-choose-file-btn">Choose file</span>
            <span
              class="sgn-file-name"
              :class="{ 'has-file': uploadedImage }"
            >{{ displayedFileName }}</span>
          </label>
          <input
            ref="fileInput"
            id="sgn-employee-version-image-upload"
            type="file"
            accept="image/*"
            hidden
            @change="handleFileChange"
          >
        </div>
        <button
          v-if="uploadedImage"
          type="button"
          class="sgn-remove-image-btn"
          @click="removeUploadedImage"
        >
          Remove image
        </button>
      </section>

      <section id="sgn-section-select" class="sgn-card">
        <div class="sgn-section-header-row">
          <h2 class="sgn-section-title">2. Select a Branded Graphic</h2>
          <span v-if="brandedGraphics.length" class="sgn-graphic-count">
            {{ brandedGraphics.length }} available
          </span>
        </div>

        <div v-if="brandedGraphics.length" class="sgn-graphics-grid">
          <button
            v-for="graphic in brandedGraphics"
            :key="graphic.id"
            type="button"
            class="sgn-graphic-card"
            :class="{ selected: selectedGraphic?.id === graphic.id }"
            :aria-label="`Select ${graphic.title}`"
            :aria-pressed="selectedGraphic?.id === graphic.id"
            @click="selectGraphic(graphic)"
          >
            <img :src="graphic.url" :alt="graphic.alt" loading="lazy">
            <span class="sgn-selected-check" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
          </button>
        </div>
        <div v-else class="sgn-graphics-loading">No branded graphics are currently available.</div>
      </section>

      <section id="sgn-section-preview" class="sgn-card">
        <h2 class="sgn-section-title">3. Live Preview &amp; Download</h2>
        <p class="sgn-section-subtitle">Your image will be automatically sized and positioned.</p>
        <div class="sgn-preview-container">
          <div class="sgn-preview-frame">
            <canvas ref="canvas" width="590" height="590" />
            <div v-if="!selectedGraphic || previewError" class="sgn-preview-placeholder">
              <p>{{ previewError || 'Select a branded graphic above to see your preview' }}</p>
            </div>
          </div>
        </div>
        <button
          class="sgn-download-btn"
          type="button"
          :disabled="!canDownload"
          @click="downloadGraphic"
        >
          Download your graphic
        </button>
        <p class="sgn-privacy-note">
          Your image will not be stored and is removed when you close this window.
        </p>
      </section>
    </div>
  </div>
</template>

<style scoped src="@/assets/css/social-graphic-generator.css"></style>
