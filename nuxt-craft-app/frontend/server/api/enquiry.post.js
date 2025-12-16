import { createError, readBody } from 'h3'
import { CREATE_ENQUIRY_MUTATION } from '~/queries/enquiries.mjs'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const {
    token,
    title,
    firstName,
    lastName,
    emailAddress,
    question,
    authorId
  } = body || {}

  if (!token) {
    throw createError({ statusCode: 400, statusMessage: 'Missing reCAPTCHA token.' })
  }

  const missingField = ['title', 'firstName', 'lastName', 'emailAddress', 'question', 'authorId']
    .find((field) => !body?.[field] || String(body[field]).trim() === '')

  if (missingField) {
    throw createError({
      statusCode: 400,
      statusMessage: `Missing required field: ${missingField}.`
    })
  }

  const config = useRuntimeConfig()

  if (!config.recaptchaSecretKey) {
    throw createError({ statusCode: 500, statusMessage: 'reCAPTCHA secret key is not configured.' })
  }

  // Verify token with Google
  const params = new URLSearchParams()
  params.append('secret', config.recaptchaSecretKey)
  params.append('response', token)

  const verification = await $fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    body: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })

  if (!verification?.success) {
    const errorCodes = verification?.['error-codes']?.join(', ') ?? 'unknown_error'

    throw createError({
      statusCode: 400,
      statusMessage: `reCAPTCHA verification failed (${errorCodes}).`
    })
  }

  if (!config.public?.CRAFT_URL || !config.public?.GRAPHQL_TOKEN) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Craft GraphQL is not configured.'
    })
  }

  const graphqlResponse = await $fetch(`${config.public.CRAFT_URL}/api`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${config.public.GRAPHQL_TOKEN}`
    },
    body: {
      query: CREATE_ENQUIRY_MUTATION,
      variables: {
        title,
        firstName,
        lastName,
        emailAddress,
        question,
        authorId
      }
    }
  })

  const entry = graphqlResponse?.data?.save_enquiries_enquiry_Entry

  if (!entry?.id) {
    const errorMessage = graphqlResponse?.errors?.[0]?.message ?? 'Unknown GraphQL error.'
    throw createError({
      statusCode: 500,
      statusMessage: `Unable to save enquiry. ${errorMessage}`
    })
  }

  return {
    success: true,
    entryId: entry.id
  }
})
