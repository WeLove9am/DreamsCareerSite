<script setup>
const props = defineProps({
  globalData: {
    type: Object,
    default: () => ({
      address: []
    })
  }
})

const address = computed(() => props.globalData?.address?.[0] || null)
</script>


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
                    <form action="" method="post">
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
                        <li>
                            <a href="#">
                                <svg>
                                    <use xlink:href="~/assets/images/sprites.svg#facebook"></use>
                                </svg>
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <svg>
                                    <use xlink:href="~/assets/images/sprites.svg#twitter"></use>
                                </svg>
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <svg>
                                    <use xlink:href="~/assets/images/sprites.svg#pinterest"></use>
                                </svg>
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <svg>
                                    <use xlink:href="~/assets/images/sprites.svg#instagram"></use>
                                </svg>
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <svg>
                                    <use xlink:href="~/assets/images/sprites.svg#youtube"></use>
                                </svg>
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <svg>
                                    <use xlink:href="~/assets/images/sprites.svg#linkedin"></use>
                                </svg>
                            </a>
                        </li>
                    </ul>
                </div>
                <div class="footer__middle">
                    <img class="footer__logo" src="~/assets/images/logo.svg" alt="logo Dreams." width="187" height="67">
                    <ul class="footer__nav">
                        <li class="footer__col">
                            <a class="footer__title" href="#">
                                <h4>Our teams</h4>
                            </a>
                            <ul class="footer__list">
                                <li>
                                    <a href="#">Retail </a>
                                </li>
                                <li>
                                    <a href="#">Distribution </a>
                                </li>
                                <li>
                                    <a href="#">Bed Factory </a>
                                </li>
                                <li>
                                    <a href="#">Bedquarters </a>
                                </li>
                            </ul>
                        </li>
                        <li class="footer__col">
                            <a class="footer__title" href="#">
                                <h4>About us</h4>
                            </a>
                            <ul class="footer__list">
                                <li>
                                    <a href="#">About us & History </a>
                                </li>
                                <li>
                                    <a href="#">Values </a>
                                </li>
                                <li>
                                    <a href="#">L&D & Staff Networks</a>
                                </li>
                                <li>
                                    <a href="#">Benefits & Wellbeing</a>
                                </li>
                            </ul>
                        </li>
                        <li class="footer__col">
                            <a class="footer__title" href="#">
                                <h4>How to apply</h4>
                            </a>
                            <ul class="footer__list">
                                <li>
                                    <a href="#">Application process</a>
                                </li>
                                <li>
                                    <a href="#">FAQs </a>
                                </li>
                            </ul>
                        </li>
                        <li class="footer__col">
                            <a class="footer__title" href="#">
                                <h4>View jobs</h4>
                            </a>
                            <ul class="footer__list">
                                <li>
                                    <a href="#">Login </a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
                <div class="footer__bottom">
                    <ul class="footer__links">
                        <li>
                            <a href="#">Terms and conditions</a>
                        </li>
                        <li>
                            <a href="#">Cookies</a>
                        </li>
                        <li>
                            <a href="#">Privacy and security</a>
                        </li>
                        <li>
                            <a href="#">Modern slavery statement Gender pay gap </a>
                        </li>
                    </ul><span class="footer__text">Dreams Limited is registered in England and Wales | Company registration number: 08428347 | Registered Office: Knaves Beech, High Wycombe, Bucks. HP10 9YU.</span>
                </div>
            </div>
        </footer>

</template>
