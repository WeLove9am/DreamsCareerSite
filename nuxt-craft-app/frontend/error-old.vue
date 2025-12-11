<template>
  <div class="error-container">
    <div class="error-content">
      <!-- Error Icon -->
      <div class="error-icon">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
          <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-7v2h2v-2h-2zm0-8v6h2V7h-2z" fill="currentColor"/>
        </svg>
      </div>

      <!-- Error Message -->
      <h1 class="error-title">
        {{ error.statusCode === 404 ? 'Page Not Found' : 'An Error Occurred' }}
      </h1>
      
      <p class="error-message">
        {{ error.statusCode === 404 
          ? 'Sorry, the page you are looking for does not exist.'
          : error.message || 'An unexpected error has occurred.'
        }}
      </p>

      <!-- Error Details (Development only) -->
      <div v-if="isDevelopment" class="error-details">
        <h3>Error Details:</h3>
        <pre class="error-stack">{{ error.stack }}</pre>
        <div class="error-info">
          <p><strong>Status Code:</strong> {{ error.statusCode }}</p>
          <p><strong>Path:</strong> {{ error.url }}</p>
          <p><strong>Message:</strong> {{ error.message }}</p>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="error-actions">
        <button @click="handleGoHome" class="btn-primary">
          Go Home
        </button>
        <button @click="handleGoBack" class="btn-secondary">
          Go Back
        </button>
        <button v-if="isFatal" @click="handleRetry" class="btn-tertiary">
          Try Again
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  error: Object
})

const route = useRoute()
const router = useRouter()

// Check if we're in development mode
const isDevelopment = process.dev

// Check if it's a fatal error (500 series)
const isFatal = computed(() => {
  return props.error.statusCode >= 500
})

// Handle navigation home
const handleGoHome = () => {
  clearError({ redirect: '/' })
}

// Handle going back
const handleGoBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    handleGoHome()
  }
}

// Handle retry for fatal errors
const handleRetry = () => {
  clearError({ redirect: route.path })
}

// Set page meta
useHead({
  title: `Error ${props.error.statusCode} - My App`,
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>

<style scoped>
.error-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, #251163 0%, #6f5f9c 100%);
}

.error-content {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 1200px;
  width: 100%;
}

.error-icon {
  color: #e53e3e;
  margin-bottom: 20px;
  display:flex;
  justify-content: center;
  align-items: center;
}
.error-icon svg {
  max-width: 64px;
}

.error-title {
  font-size: 2rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 16px;
}

.error-message {
  color: #718096;
  font-size: 1.125rem;
  margin-bottom: 30px;
  line-height: 1.6;
}

.error-details {
  text-align: left;
  margin: 30px 0;
  padding: 20px;
  background: #f7fafc;
  border-radius: 8px;
  border-left: 4px solid #e53e3e;
}

.error-details h3 {
  margin-top: 0;
  color: #2d3748;
}

.error-stack {
  background: #2d3748;
  color: #e2e8f0;
  padding: 15px;
  border-radius: 6px;
  font-size: 0.875rem;
  overflow-x: auto;
  white-space: pre-wrap;
  margin: 10px 0;
}

.error-info p {
  margin: 8px 0;
  font-family: monospace;
}

.error-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary, .btn-secondary, .btn-tertiary {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  display: inline-block;
}

.btn-primary {
  color: white;
  background: #6f5f9c;
}

.btn-primary:hover {
  background: #251163;
}

.btn-secondary {
  background: #e2e8f0;
  color: #4a5568;
}

.btn-secondary:hover {
  background: #cbd5e0;
}

.btn-tertiary {
  background: #48bb78;
  color: white;
}

.btn-tertiary:hover {
  background: #38a169;
}

/* Responsive design */
@media (max-width: 640px) {
  .error-content {
    padding: 30px 20px;
  }
  
  .error-title {
    font-size: 1.5rem;
  }
  
  .error-actions {
    flex-direction: column;
  }
  
  .btn-primary, .btn-secondary, .btn-tertiary {
    width: 100%;
  }
}
</style>