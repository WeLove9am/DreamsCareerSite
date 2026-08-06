import { createError, getQuery, setResponseHeader } from 'h3'

export default defineEventHandler(async (event) => {
  const requestedUrl = getQuery(event).url
  const craftUrl = useRuntimeConfig(event).public?.CRAFT_URL

  if (typeof requestedUrl !== 'string' || !craftUrl) {
    throw createError({
      statusCode: 400,
      statusMessage: 'A valid Craft image URL is required.',
    })
  }

  let imageUrl
  let allowedOrigin

  try {
    imageUrl = new URL(requestedUrl)
    allowedOrigin = new URL(craftUrl).origin
  } catch {
    throw createError({
      statusCode: 400,
      statusMessage: 'The image URL is invalid.',
    })
  }

  if (!['http:', 'https:'].includes(imageUrl.protocol) || imageUrl.origin !== allowedOrigin) {
    throw createError({
      statusCode: 403,
      statusMessage: 'The image must be hosted by the configured Craft CMS instance.',
    })
  }

  const response = await fetch(imageUrl, {
    headers: {
      Accept: 'image/*',
    },
  })

  if (!response.ok || new URL(response.url).origin !== allowedOrigin) {
    throw createError({
      statusCode: response.status || 502,
      statusMessage: 'The branded graphic could not be loaded.',
    })
  }

  const contentType = response.headers.get('content-type') || ''
  if (!contentType.toLowerCase().startsWith('image/')) {
    throw createError({
      statusCode: 415,
      statusMessage: 'The requested Craft asset is not an image.',
    })
  }

  const contentLength = Number(response.headers.get('content-length') || 0)
  if (contentLength > 20 * 1024 * 1024) {
    throw createError({
      statusCode: 413,
      statusMessage: 'The branded graphic is too large.',
    })
  }

  setResponseHeader(event, 'Content-Type', contentType)
  setResponseHeader(event, 'Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400')

  return new Uint8Array(await response.arrayBuffer())
})
