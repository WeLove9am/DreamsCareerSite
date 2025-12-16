<script setup>
import { computed } from 'vue'
import { useRoute } from '#app'
const route = useRoute()

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
				<div class="header__inner dreams-amris">
                <Logo :siteName="siteName" :logo="globalData.logo" />
					<div class="header__menu">
						<nav class="menu">
							<ul class="menu__list">
								<li v-for="(item, index) in headernav" :key="item.id" class="menu__item">
									<a
                    class="menu__link"
                    :class="{ activeLink: isParentActive(item) }"
                    :data-collapse-target="`menu${index + 1}`"
                    data-collapse-group="menu"
                    :href="item.pageLink.startsWith('/') ? item.pageLink : `/${item.pageLink}`"
                  >{{ item.title }}
                </a>
								</li>
							</ul>
						</nav>
					</div>
					<div class="header__links"> 
						
						<div class="dropdown">
							<input type="checkbox" id="menuToggle" class="dropdown-toggle">
							<label for="menuToggle" class="dropdown-label">
								Login
								<span class="dropdown-arrow"></span>
							</label>
							<ul class="dropdown-menu">
								<li><a href="/login" class="loggedOut">Login</a></li>
								<li><a href="/job-alerts">Job Alert</a></li>
								<li><a href="/candidate-centre" class="loggedIn">Candidate Centre</a></li>
								<li><a href="/logout=1" class="loggedIn">Logout</a></li>
							</ul>
						</div>
                    
					</div>
					<a class="header__login loggedOut" href="/login">Login</a>
					<a class="header__login"  href="/job-alerts">Job Alert</a>
					<a class="header__login loggedIn" href="/candidate-centre">Candidate Centre</a>
					<a class="header__login loggedIn" href="/logout=1">Logout</a>
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
