// https://nuxt.com/docs/api/configuration/nuxt-config
//import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',

  devtools: {
    enabled: true,
    wsUrl: process.env.BASE_URL?.replace('https://', ''),
    port: 3000,
    https: true
  },

  css: [
    '~/assets/css/main.css?version=1.0.6', '~/assets/css/custom.css?version=1.0.6'
  ],

  app: {
    head: {
      titleTemplate: '%s | ' + process.env.SITE_NAME,
      title: process.env.SITE_NAME,
      script: [
        { src: 'https://cdn.jsdelivr.net/gh/mdbassit/FancySelect@latest/dist/fancyselect.min.js', defer: true },
        { src: 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js', defer: true },
        { src: 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js', defer: true },
        { src: 'https://cdn.jsdelivr.net/npm/gsap@3.13/dist/ScrollToPlugin.min.js', defer: true},
        { src: '/js/main.js?version=1.0.6', type:'module', defer: true },  
        { src: '/js/vendor.js?version=1.0.6', type:'module', defer: true }
      ]
    }
  },

  // plugins: [
  //   '~/plugins/delayed-scripts.client.ts'
  // ],

  //debug: true,

  // build: {
  //   transpile: ['gsap'],
  // },

  devServer: {
    host: '0.0.0.0',
    port: 3000
  },

  runtimeConfig: {
    public: {
      GRAPHQL_TOKEN: process.env.GRAPHQL_TOKEN,
      CRAFT_URL: process.env.CRAFT_URL,
      BASE_URL: process.env.BASE_URL,
      SITE_NAME: process.env.SITE_NAME,
      googleMapsApiKey: process.env.NUXT_PUBLIC_GOOGLE_MAPS_API_KEY,
      mapboxAccessToken: process.env.NUXT_PUBLIC_MAPBOX_ACCESS_TOKEN
    }
  },

  vite: {
    plugins: [
      //tailwindcss()
    ],
    server: {
      https: true,
      hmr: {
        protocol: 'wss',
        host: process.env.BASE_URL?.replace('https://', ''),
        port: 3000
      },
      allowedHosts: [
        'dreams-nuxt-craft.ddev.site',
        '.ddev.site'
      ]
    }
  },

  nitro: {
    devServer: {
      watch: ['./server']
    }
  },

  experimental: {
    payloadExtraction: false
  },

  modules: ['@nuxt/image',]
});