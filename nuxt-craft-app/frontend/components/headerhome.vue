<script setup>
import { useRoute } from '#app'
const route = useRoute()

// Example: https://your-site.com/jobs/{slug}/{id}
const isJobDetailPage = computed(() => {
  return /^\/jobs\/[^/]+\/\d+$/.test(route.path)
})

// You get the id from route params
const jobId = computed(() => route.params.id)

const props = defineProps({
  globalData: {
    type: Object,
    default: () => ({
      logo: {
        url: '',
        alt: ''
      }
    })
  },
  pages: {
    type: Array,
    default: () => []
  },
  headernav: {
    type: Array,
    default: () => []
  }
})

// Check if parent menu item is active based on child links
function isParentActive(item) {
  if (!item.children?.length) return false

  return item.children.some(child => {
    if (!child.pageLink) return false

    // Normalize both paths (ensure they start with '/')
    const childPath = child.pageLink.startsWith('/')
      ? child.pageLink
      : '/' + child.pageLink

    return childPath === route.path
  })
}

const { public: { SITE_NAME } } = useRuntimeConfig()
const siteName = computed(() => SITE_NAME || 'Site Name')
</script>

<template>
  <header class="header">
				<div class="header__inner">
                <Logo :siteName="siteName" :logo="globalData.logo" />
					<div class="header__menu">
						<nav class="menu">
							<ul class="menu__list">
								<li v-for="(item, index) in headernav" :key="item.id" class="menu__item">
									<button class="menu__link" :class="{ activeLink: isParentActive(item) }" :data-collapse-target="`menu${index + 1}`" data-collapse-group="menu">{{ item.title }}</button>
									<ul class="menu__content" v-if="item.children?.length"> 
										<li :data-collapse-content="`menu${index + 1}`">
											<div class="swiper slider-menu slider-menu1">
												<div class="swiper-wrapper">
													<div class="swiper-slide" v-for="child in item.children" :key="child.id">
                            <a class="menu__content-link" 
                            :href="child.pageLink.startsWith('/') ? child.pageLink : `/${child.pageLink}`"
                            >
                              <NuxtImg
                                v-if="child.image?.[0]?.url" 
                                :src="child.image[0].url" 
                                :alt="child.image[0].alt || child.title"
                                loading="lazy"
                              />
                              <h3>{{ child.title }}</h3>
                            </a>
                          </div>
												</div>
												<div class="swiper-pagination"></div>
												<div class="swiper-navigation">
													<button class="swiper-button-prev">
														<svg>
															<use xlink:href="~/assets/images/sprites.svg#chevron-left"></use>
														</svg>
													</button>
													<button class="swiper-button-next">
														<svg>
															<use xlink:href="~/assets/images/sprites.svg#chevron-right"></use>
														</svg>
													</button>
												</div>
											</div>
										</li>
									</ul>
								</li>
							</ul>
						</nav>
					</div>
					<div class="header__links"> 
						<a
						v-if="isJobDetailPage"
						class="header__link job_link"
						:href="`https://dreams-careers.com/applyForm.php?requirementId=${jobId}`"
					>
						Apply now
					</a>

					<a
						v-else
						class="header__link"
						href="/jobs"
					>
						View jobs
					</a>
					<a class="header__link" href="">
                        <svg>
                            <use xlink:href="~/assets/images/sprites.svg#search"></use>
                        </svg>
                    </a>
					</div><a class="header__login" href="https://dreams-careers.com/login/" target="_blank">Login</a>
					<div class="header__menu-toggle">
						<button class="menu-toggle js-toggle-menu" type="button">
							<div class="menu-icon">
								<div class="menu-icon__line"></div>
								<div class="menu-icon__line"></div>
								<div class="menu-icon__line"></div>
							</div>
						</button>
					</div>
				</div>
			</header>
</template>
