// server/routes/recruitment/[...path].ts
import { defineEventHandler, getQuery, readBody, getHeader, setHeader, createError } from 'h3'
import { $fetch } from 'ofetch'

export default defineEventHandler(async (event) => {
  const path = event.context.params?.path || ''
  const query = getQuery(event)
  const method = event.node.req.method

  // Build target URL
  const targetUrl = new URL(`https://stagingdreams.amris-wizard-proxy.com/${path}`)

  // Append query strings
  Object.entries(query).forEach(([key, value]) => {
    targetUrl.searchParams.append(key, String(value))
  })

  try {
    // Read body for POST / PUT
    let body
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      body = await readBody(event)
    }

    // Proxy request
    const response = await $fetch(targetUrl.toString(), {
      method,
      body,
      headers: {
        'Host': 'stagingdreams.amris-wizard-proxy.com',
        'X-Forwarded-Proto': 'https',
        'X-Forwarded-Host': 'careers.dreams.co.uk',
        'X-Real-IP': getHeader(event, 'x-real-ip') || '',
        'User-Agent': getHeader(event, 'user-agent') || '',
        'Cookie': getHeader(event, 'cookie') || ''
      },
      onResponse({ response }) {
        const setCookie = response.headers.get('set-cookie')
        if (setCookie) setHeader(event, 'set-cookie', setCookie)
      }
    })

    return response

  } catch (error: any) {
    console.error('AMRIS Proxy Error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'AMRIS proxy failed'
    })
  }
})
