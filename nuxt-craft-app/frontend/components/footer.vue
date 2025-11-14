<script setup>
const props = defineProps({
  globalData: {
    type: Object,
    default: () => ({
      address: [],
      logo: {
        url: '',
        alt: ''
      },
      text: '',
      socials:{
        title: '',
        pageLink: '',
        show: false
      }
    })
  },
footerData: {
    type: Object,
    default: () => ({})
},
footer2Data: {
    type: Object,
    default: () => ({})
}
})

const address = computed(() => props.globalData?.address?.[0] || null)
</script>

console(props.footerData[0])
<template>
  <!--<footer class="bg-slate-50 py-6 px-2 text-sm">
    <address 
      v-if="address"
      class="container mx-auto not-italic"
    >
      <p class="font-bold">{{ address.title }}</p>
      <p>
        <template v-if="address.addressLine1">
          {{ address.addressLine1 }}<br>
        </template>
        <template v-if="address.addressLine2">
          {{ address.addressLine2 }}<br>
        </template>
        <template v-if="address.addressLine3">
          {{ address.addressLine3 }}<br>
        </template>
        {{ address.locality }} {{ address.postalCode }}<br>
        {{ address.countryCode }}
      </p>
    </address>
    <div v-else class="container mx-auto">
      <tip>Add an address by visiting Entries &rarr; Globals in the control panel!</tip>
    </div>
  </footer> -->

          <footer class="footer background-primary">
            <div class="footer__inner">
                <div class="footer__search">
                    <form action="/jobs" method="get">
                        <div class="control">
                            <input class="input input--round" type="search" name="search" placeholder="Search roles">
                            <button class="input__icon" type="submit">
                                <svg>
                                    <use xlink:href="~/assets/images/sprites.svg#search"></use>
                                </svg>
                            </button>
                        </div>
                    </form>
                </div>
                <div class="footer__social">
                    <ul class="social-links">
                        <template v-for="gLink in globalData.socials">
                        <li :key="gLink.id" v-if="gLink.show">
                            <a :href="gLink.pageLink" target="_blank">
                                <svg>
                                    <use :xlink:href="`/images/sprites.svg#${gLink.title.toLowerCase()}`"></use>
                                </svg>
                            </a>
                        </li>
                        </template>
                    </ul>
                </div>
                <div class="footer__middle">
                     <template v-if="globalData.logo.length > 0">
                        <img 
                            :src="globalData.logo[0].url" 
                            :alt="globalData.logo[0].alt" 
                            class="footer__logo" width="187" height="67"
                        />
                    </template>
                    <ul class="footer__nav">
                        <li class="footer__col" v-for="item in footerData" :key="item.id">
                            <a class="footer__title" :href="item.pageLink.startsWith('/') ? item.pageLink : `/${item.pageLink}`">
                                <h4>{{ item.title }}</h4>
                            </a>
                            <ul class="footer__list">
                                <li v-for="child in item.children" :key="child.id">
                                    <a 
                                    :href="child.pageLink.startsWith('http') ? child.pageLink : 
                                            child.pageLink.startsWith('/') ? child.pageLink : 
                                            `/${child.pageLink}`" 
                                    :target="child.pageLink.startsWith('http') ? '_blank' : '_self'"
                                    >{{ child.title }} </a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
                <div class="footer__bottom">
                    <ul class="footer__links">
                        <li v-for="fLink in footer2Data" :key="fLink.id">
                            <a :href="fLink.pageLink.startsWith('/') ? fLink.pageLink : `/${fLink.pageLink}`">{{ fLink.title }}</a>
                        </li>
                    </ul><span class="footer__text">{{ globalData.text }}</span>
                </div>
            </div>
        </footer>

</template>
