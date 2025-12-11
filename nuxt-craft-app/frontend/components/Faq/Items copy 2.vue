<script setup>
import { ref } from 'vue'
import { useFlashes } from '~/composables/useFlashes'

const props = defineProps({
  subTitle: String,
  caption: String,
  copy: String,
  qands: Array,
  authorId: Number
})

const { addFlash } = useFlashes()

// Form fields
const firstName = ref('')
const lastName = ref('')
const emailAddress = ref('')
const question = ref('')
const gdprConsent = ref(false)
const privacyConsent = ref(false)

// States
const loading = ref(false)
const success = ref(false)
const error = ref(false)

// Simple validation
const validateForm = () => {
  if (!firstName.value.trim()) return 'Please enter your first name.'
  if (!lastName.value.trim()) return 'Please enter your last name.'
  if (!emailAddress.value.trim()) return 'Please enter your email address.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress.value))
    return 'Please enter a valid email address.'
  if (!question.value.trim()) return 'Please enter your question.'
  if (!gdprConsent.value) return 'Please confirm GDPR permission.'
  if (!privacyConsent.value) return 'Please confirm you agree to the privacy policy.'
  return null
}

// Submit Handler (reCAPTCHA v3 + Craft backend)
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
    // 1️⃣ Get reCAPTCHA token
    const siteKey = useRuntimeConfig().public.recaptchaSiteKey
    const token = await grecaptcha.execute(siteKey, { action: 'submit' })

    // 2️⃣ Build Craft CMS endpoint from env
    const craftUrl = useRuntimeConfig().public.CRAFT_URL

    // 3️⃣ Submit to Craft via dynamic URL
    const response = await $fetch(`${craftUrl}/actions/enquiry-module/enquiry/submit`, {
      method: "POST",
      body: {
        token,
        title: `Enquiry from ${firstName.value} ${lastName.value}`,
        firstName: firstName.value,
        lastName: lastName.value,
        emailAddress: emailAddress.value,
        question: question.value,
        authorId: props.authorId.toString()
      }
    })

    if (!response.success) {
      throw new Error(response.message)
    }

    addFlash("Thank you! Your enquiry has been submitted.", "success")
    success.value = true

    // Reset form
    firstName.value = ''
    lastName.value = ''
    emailAddress.value = ''
    question.value = ''
    gdprConsent.value = false
    privacyConsent.value = false

  } catch (err) {
    error.value = err.message
    addFlash(err.message, "error")
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

      <!-- Tabs -->
      <div class="tabs" data-tabs="tabs">
        <button
          v-for="(item, index) in qands"
          :key="item.id"
          class="button"
          :data-tab="'tab' + (index + 1)"
          :class="{ 'is-active': index === 0 }"
        >
          {{ item.title }}
        </button>
      </div>

      <!-- Tab Content -->
      <div class="tab-content" data-tabs-content="tabs">
        <div
          v-for="(item, index) in qands"
          :key="item.id"
          class="tab-slide"
          :data-tab-content="'tab' + (index + 1)"
          :class="{ 'is-active': index === 0 }"
        >
          <template v-if="item.items && item.items.length > 0">
            <div class="tab-slide-wrapper">
              
              <!-- Top items -->
              <div class="tab-slide__top faq-boxes">
                <div
                  v-for="(card, cardIndex) in item.items.slice(0, Math.ceil(item.items.length / 2))"
                  :key="cardIndex"
                  class="card"
                >
                  <h3>{{ card.title }}</h3>
                  <h4>{{ card.subTitle }}</h4>
                  <p>{{ card.copy }}</p>

                  <!-- FORM -->
                  <form
                    method="post"
                    @submit.prevent="submitEnquiry"
                    class="tab-slide__form"
                    v-if="card.showEnquiryForm"
                  >
                    <p v-if="success" class="form-success">
                      ✅ Thank you! Your enquiry has been submitted successfully.
                    </p>

                    <div v-if="error" class="alert error-message" style="color: red; margin-bottom: 10px;">
                      Error: {{ error }}
                    </div>

                    <input class="input" type="text" placeholder="First Name" v-model="firstName" required />
                    <input class="input" type="text" placeholder="Last Name" v-model="lastName" required />
                    <input class="input" type="email" placeholder="Email" v-model="emailAddress" required />
                    <textarea class="input" placeholder="Write your question(s) here" rows="6" v-model="question" required></textarea>

                    <!-- Checkboxes -->
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

                    <input class="button button--primary" type="submit" :value="loading ? 'Submitting…' : 'Submit'" :disabled="loading" />
                  </form>
                </div>
              </div>

              <!-- Bottom items -->
              <div class="tab-slide__bottom faq-boxes">
                <div
                  v-for="(card, cardIndex) in item.items.slice(Math.ceil(item.items.length / 2))"
                  :key="cardIndex + item.items.length"
                  class="card"
                >
                  <h3>{{ card.title }}</h3>
                  <h4>{{ card.subTitle }}</h4>
                  <p>{{ card.copy }}</p>

                  <!-- FORM (same as above) -->
                  <form
                    method="post"
                    @submit.prevent="submitEnquiry"
                    class="tab-slide__form"
                    v-if="card.showEnquiryForm"
                  >
                    <p v-if="success" class="form-success">✅ Thank you! Your enquiry has been submitted.</p>
                    <div v-if="error" class="alert error-message" style="color: red; margin-bottom: 10px;">
                      Error: {{ error }}
                    </div>

                    <input class="input" type="text" placeholder="First Name" v-model="firstName" required />
                    <input class="input" type="text" placeholder="Last Name" v-model="lastName" required />
                    <input class="input" type="email" placeholder="Email" v-model="emailAddress" required />
                    <textarea class="input" rows="6" placeholder="Write your question(s) here" v-model="question" required></textarea>

                    <!-- Checkboxes -->
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

                    <input class="button button--primary" type="submit" :value="loading ? 'Submitting…' : 'Submit'" :disabled="loading" />
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