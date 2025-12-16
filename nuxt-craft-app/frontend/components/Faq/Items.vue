
<script setup>
import { ref, onMounted } from 'vue'
import { useFlashes } from '~/composables/useFlashes'

const props = defineProps({
    subTitle: {
        type: String,
        default: ''
    },
    caption: {
        type: String,
        default: ''
    },
    copy: {
        type: String,
        default: ''
    },
    qands: {
        type: Array,
        default: () => []
    },
    authorId: {
        type: Number,
        required: true
    }
    
})

const { addFlash } = useFlashes()
const runtimeConfig = useRuntimeConfig()

const loadRecaptchaScript = () => {
  if (typeof window === 'undefined') {
    return
  }

  const siteKey = runtimeConfig.public?.recaptchaSiteKey

  if (!siteKey) {
    console.warn('reCAPTCHA site key missing; tab-slide forms will skip verification.')
    return
  }

  const scriptId = 'google-recaptcha-script'

  if (document.getElementById(scriptId)) {
    return
  }

  const script = document.createElement('script')
  script.id = scriptId
  script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`
  script.async = true
  script.defer = true
  document.head.appendChild(script)
}

const ensureRecaptchaReady = () => {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('reCAPTCHA can only run in the browser.'))
  }

  loadRecaptchaScript()

  return new Promise((resolve, reject) => {
    let attempts = 0
    const maxAttempts = 40

    const checkForRecaptcha = () => {
      attempts += 1
      if (window.grecaptcha) {
        window.grecaptcha.ready(() => resolve(window.grecaptcha))
        return
      }

      if (attempts >= maxAttempts) {
        reject(new Error('Unable to load reCAPTCHA. Please try again.'))
        return
      }

      setTimeout(checkForRecaptcha, 200)
    }

    checkForRecaptcha()
  })
}

onMounted(() => {
  loadRecaptchaScript()
})
const getRecaptchaToken = async () => {
  const siteKey = runtimeConfig.public?.recaptchaSiteKey

  if (!siteKey) {
    throw new Error('reCAPTCHA is not configured.')
  }

  const grecaptcha = await ensureRecaptchaReady()
  return grecaptcha.execute(siteKey, { action: 'tab_slide_form_submit' })
}

// Form fields
const firstName = ref('')
const lastName = ref('')
const emailAddress = ref('')
const question = ref('')
const gdprConsent = ref(false)
const privacyConsent = ref(false)

const loading = ref(false)
const success = ref(false)
const error = ref(false)

// Simple validation
const validateForm = () => {
  if (!firstName.value.trim()) return 'Please enter your first name.'
  if (!lastName.value.trim()) return 'Please enter your last name.'
  if (!emailAddress.value.trim()) return 'Please enter your email address.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress.value)) return 'Please enter a valid email address.'
  if (!question.value.trim()) return 'Please enter your question.'
  if (!gdprConsent.value) return 'Please confirm GDPR permission.'
  if (!privacyConsent.value) return 'Please confirm you agree to the privacy policy.'
  return null
}

// Submit handler
const submitEnquiry = async () => {
  error.value = false
  success.value = false
  const errorMsg = validateForm()
  if (errorMsg) {
    addFlash(errorMsg, 'error')
    return
  }

  loading.value = true

  try {
    const title = `Enquiry from ${firstName.value} ${lastName.value}`

    const token = await getRecaptchaToken()

    const response = await $fetch('/api/enquiry', {
      method: 'POST',
      body: {
        token,
        title,
        firstName: firstName.value,
        lastName: lastName.value,
        emailAddress: emailAddress.value,
        question: question.value,
        authorId: props.authorId.toString()
      }
    })

    if (!response?.success) {
      throw new Error('No confirmation received from the server.')
    }

    addFlash('✅ Thank you! Your enquiry has been submitted.', 'success')
    success.value = true

    // Reset form
    firstName.value = ''
    lastName.value = ''
    emailAddress.value = ''
    question.value = ''
    gdprConsent.value = false
    privacyConsent.value = false
  } catch (err) {
    console.error('Enquiry submission failed:', err)
    error.value = `⚠️ Error submitting form: ${err.message}`
    addFlash(`⚠️ Error submitting form: ${err.message}`, 'error')
  } finally {
    loading.value = false
  }
}
</script>
<template>
                <section class="section">
                <div class="container">
                    <div class="section-header">
                        <h2 v-if="subTitle">{{ subTitle }}</h2>
                        <h3 v-if="caption">{{ caption }}</h3>
                        <p v-if="copy">{{ copy }}</p>
                    </div>
                    <div class="tabs" data-tabs="tabs">
                        <button 
                            v-for="(item, index) in qands" 
                            :key="item.id" 
                            class="button" 
                            :data-tab="'tab' + (index + 1)" 
                            :class="{'is-active': index === 0}" 
                        >
                            {{ item.title }}
                        </button>
                    </div>
                    <div class="tab-content" data-tabs-content="tabs">
                        <div 
                        v-for="(item, index) in qands" 
                        :key="item.id" 
                        class="tab-slide" 
                        :data-tab-content="'tab' + (index + 1)" 
                        :class="{'is-active': index === 0}" 
                    >
                        <template v-if="item.items && item.items.length > 0">
                            <div class="tab-slide-wrapper">
                                <div class="tab-slide__top faq-boxes">
                                    <div 
                                        v-for="(card, cardIndex) in item.items.slice(0, Math.ceil(item.items.length / 2))" 
                                        :key="cardIndex" 
                                        class="card"
                                    >
                                        <h3>{{ card.title }}</h3>
                                        <h4>{{ card.subTitle }}</h4>
                                        <p>{{ card.copy }}</p>

                                        <form method="post" @submit.prevent="submitEnquiry" class="tab-slide__form" v-if="card.showEnquiryForm">
                                            <p v-if="success" class="form-success">
                                            ✅ Thank you! Your enquiry has been submitted successfully.
                                            </p>
                                            <div v-if="error" class="alert error-message" style="color: red; margin-bottom: 10px;">
                                            Error: {{ error }}
                                            </div>
                                            <input
                                            class="input"
                                            type="text"
                                            name="first-name"
                                            placeholder="First Name"
                                            v-model="firstName"
                                            required
                                            />
                                            <input
                                            class="input"
                                            type="text"
                                            name="last-name"
                                            placeholder="Last Name"
                                            v-model="lastName"
                                            required
                                            />
                                            <input
                                            class="input"
                                            type="email"
                                            name="emailAddress"
                                            placeholder="Email address"
                                            v-model="emailAddress"
                                            required
                                            />
                                            <textarea
                                            class="input"
                                            name="question"
                                            placeholder="Write your question(s) here"
                                            rows="6"
                                            v-model="question"
                                            required
                                            ></textarea>
                                            <div class="tab-slide__checkboxes">
                                                <label class="checkbox">
                                                    <input class="checkbox-input" type="checkbox" name="checkbox" v-model="gdprConsent" required/>
                                                    <div class="checkbox-box"><span class="checkbox-box__label">I acknowledge and give permission for my data to be held by Dreams and WeLove9am in accordance with the General Data Protection Regulation</span></div>
                                                </label>
                                                <label class="checkbox">
                                                    <input class="checkbox-input" type="checkbox" name="checkbox" v-model="privacyConsent" required/>
                                                    <div class="checkbox-box"><span class="checkbox-box__label">I have read and agree to the privacy policy</span></div>
                                                </label>
                                            </div>
                                            <input
                                            class="button button--primary"
                                            type="submit"
                                            :value="loading ? 'Submitting…' : 'Submit'"
                                            :disabled="loading"
                                            >

                                        </form>


                                    </div>
                                </div>

                                <div class="tab-slide__bottom faq-boxes">
                                    <div 
                                        v-for="(card, cardIndex) in item.items.slice(Math.ceil(item.items.length / 2))" 
                                        :key="cardIndex + item.items.length" 
                                        class="card"
                                    >
                                        <h3 :id="cardIndex === 1 ? 'contact' : ''">{{ card.title }}</h3>
                                        <h4>{{ card.subTitle }}</h4>
                                        <p>{{ card.copy }}</p>
                                        <form method="post" @submit.prevent="submitEnquiry" class="tab-slide__form" v-if="card.showEnquiryForm">
                                            <p v-if="success" class="form-success">
                                            ✅ Thank you! Your enquiry has been submitted successfully.
                                            </p>
                                            <input
                                            class="input"
                                            type="text"
                                            name="first-name"
                                            placeholder="First Name"
                                            v-model="firstName"
                                            required
                                            />
                                            <input
                                            class="input"
                                            type="text"
                                            name="last-name"
                                            placeholder="Last Name"
                                            v-model="lastName"
                                            required
                                            />
                                            <input
                                            class="input"
                                            type="email"
                                            name="emailAddress"
                                            placeholder="Email address"
                                            v-model="emailAddress"
                                            required
                                            />
                                            <textarea
                                            class="input"
                                            name="question"
                                            placeholder="Write your question(s) here"
                                            rows="6"
                                            v-model="question"
                                            required
                                            ></textarea>
                                            <div class="tab-slide__checkboxes">
                                                <label class="checkbox">
                                                    <input class="checkbox-input" type="checkbox" name="checkbox" v-model="gdprConsent" required/>
                                                    <div class="checkbox-box"><span class="checkbox-box__label">I acknowledge and give permission for my data to be held by Dreams and WeLove9am in accordance with the General Data Protection Regulation</span></div>
                                                </label>
                                                <label class="checkbox">
                                                    <input class="checkbox-input" type="checkbox" name="checkbox" v-model="privacyConsent" required/>
                                                    <div class="checkbox-box"><span class="checkbox-box__label">I have read and agree to the privacy policy</span></div>
                                                </label>
                                            </div>
                                            <input
                                            class="button button--primary"
                                            type="submit"
                                            :value="loading ? 'Submitting…' : 'Submit'"
                                            :disabled="loading"
                                            >

                                        </form>

                                        
                                    </div>
                                </div>
                            </div>
                        </template>
                        
                        <div v-else>No content available.</div>
                    </div>
                    </div>
                </div>
            </section>

</template>
