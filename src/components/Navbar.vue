<script setup>
import { ref, onMounted, watch, onUnmounted } from 'vue'
import Search from './Search.vue'
import { useRoute } from 'vue-router'
import { useStore } from '../store'
import { supabase } from '../supabase'
import VButton from './VButton.vue'
import VImage from './VImage.vue'

const listItems = ref([
    {
      title: 'Trending',
      path: ''
    },
    {
      title: 'Movies',
      path: 'movies'
    },
    {
      title: 'Series',
      path: 'series'
    }
  ]),
  navOpen = ref(false),
  optionsMenu = ref(false),
  nav = ref(),
  store = useStore(),
  route = useRoute()

watch(navOpen, () => {
  if (navOpen.value) document.body.style.overflow = 'hidden'
  else document.body.style.overflow = 'overlay'
})

onMounted(() => {
  if (
    route.path === '/' ||
    route.path === '/movies' ||
    route.path === '/series'
  ) {
    nav.value?.classList.add('bg-wf-300/80')
    nav.value?.classList.add('backdrop-blur-lg')
  } else {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        nav.value?.classList.add('bg-wf-300/80')
        nav.value?.classList.add('backdrop-blur-lg')
      } else {
        nav.value?.classList.remove('bg-wf-300/80')
        nav.value?.classList.remove('backdrop-blur-lg')
      }
    })
  }

  window.addEventListener('keydown', (e) => handleSearchShortcuts(e))
})

onUnmounted(() => {
  window.removeEventListener('keydown', (e) => handleSearchShortcuts(e))
})

const searchDialog = ref(false)

const showSearchDialog = () => {
  searchDialog.value = true
}

const hideSearchDialog = () => {
  searchDialog.value = false
}

const handleSearchShortcuts = (e) => {
  if ((e.ctrlKey && e.key === 'k') || e.key === '/') {
    e.preventDefault()
    searchDialog.value = !searchDialog.value
  }
}

const toggleOptionsMenu = () => {
  if (!optionsMenu.value) {
    window.addEventListener(
      'mouseup',
      (e) => {
        if (e.target.dataset.optionsmenu === 'x') return
        optionsMenu.value = false
      },
      { once: true }
    )
  }

  optionsMenu.value = !optionsMenu.value
}

const logout = () => {
  supabase.auth.signOut()
  store.user = null
}
</script>

<template>
  <nav class="fixed top-0 z-30 w-full px-5 pt-3 pb-2 transition-all" ref="nav">
    <div class="mx-auto flex w-full max-w-break items-center justify-between">
      <div class="flex items-center gap-5">
        <ul class="flex items-center gap-2">
          <li class="-mb-2 md:hidden">
            <button
              class="mb-2 text-green-300 transition-colors hover:text-green-500"
              ref="hamButton"
              @click="navOpen = !navOpen"
            >
              <svg
                class="h-8 w-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 8h16M4 16h16"
                ></path>
              </svg>
            </button>
          </li>
          <router-link
            to="/"
            class="clear font-bebasNeue text-5xl text-green-300 transition-colors hover:text-green-400 md:text-6xl"
            >WEBFLIX</router-link
          >
          <li
            v-for="item in listItems"
            :key="item.title"
            class="ml-2 hidden md:flex"
          >
            <router-link
              @click="navOpen = false"
              :to="`/${item.path}`"
              class="text-xl text-green-300 transition-colors hover:text-green-500"
              >{{ item.title }}</router-link
            >
          </li>
        </ul>
      </div>
      <ul class="relative z-30 mb-1 flex items-center gap-3 text-gray-300">
        <li class="-mb-2" v-if="route.name !== 'search'">
          <button
            @click="showSearchDialog"
            class="group mb-2 flex items-center gap-2 p-2"
          >
            <svg
              class="h-7 w-7 text-green-300 md:h-5 md:w-5 md:text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
            <span
              class="items-starts hidden gap-1 rounded border p-0.5 font-stMono font-light transition-colors group-hover:border-green-300 group-hover:text-green-300 md:flex"
            >
              <span class="text-[0.45rem]">CTRL</span>
              <span class="text-[0.6rem]">K</span>
            </span>
          </button>
        </li>

        <li v-if="store.user">
          <div class="relative">
            <button
              data-optionsMenu="x"
              @click="toggleOptionsMenu()"
              class="h-12 w-12 rounded-full shadow-lg outline-none focus:outline-none focus:ring-2"
            >
              <VImage
                class="h-12 w-12 rounded-full"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ79GjtRSlnYnEiHzWrOj29US2HRtXI_olH1A&usqp=CAU"
              />
            </button>
            <transition name="fade">
              <div
                v-if="optionsMenu"
                class="absolute top-14 right-0 w-[250px] rounded-md bg-wf-200 shadow-xl"
              >
                <ul
                  class="overflow-hidden rounded-md [&>*>button:hover]:bg-wf-100 [&>*>button]:w-full [&>*>button]:bg-wf-200 [&>*>button]:px-3 [&>*>button]:py-1.5 [&>*>button]:text-left [&>*>button]:ring-inset [&>*>button:focus]:outline-none [&>*>button:focus]:ring-2 [&>*:first-child>button]:rounded-t-md [&>*:last-child>button]:rounded-b-md"
                >
                  <li>
                    <button class="truncate">
                      @{{ store.user.user_metadata.name }}
                    </button>
                  </li>
                  <li><button>Favourites</button></li>
                  <li><button>Watchlist</button></li>
                  <li>
                    <button
                      @click="logout()"
                      class="!bg-red-900 hover:!bg-red-800"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            </transition>
          </div>
        </li>
        <li v-else>
          <VButton to="/auth">Login</VButton>
        </li>
      </ul>
      <div
        v-if="navOpen"
        class="fixed top-0 left-0 h-screen w-screen"
        @click="navOpen = false"
      ></div>
      <transition name="expand">
        <div
          v-if="navOpen"
          ref="overlayMenu"
          class="fixed top-0 right-0 z-20 min-h-screen w-9/12 overflow-hidden bg-wf-200 transition-all duration-300"
        >
          <ul
            class="mb-2 mt-20 flex flex-col items-end justify-end divide-y divide-gray-700 transition-opacity"
            :class="navOpen ? '' : 'opacity-0'"
          >
            <li
              v-for="item in listItems"
              :key="item.title"
              class="w-full text-2xl font-medium text-green-300 transition-colors hover:bg-wf-300 hover:text-green-500"
            >
              <router-link class="block px-5 py-3" :to="`/${item.path}`">{{
                item.title
              }}</router-link>
            </li>
          </ul>
        </div>
      </transition>
    </div>
  </nav>

  <Search :searchDialog="searchDialog" @hideSearchDialog="hideSearchDialog" />
</template>

<style>
.expand-enter-active,
.expand-leave-active {
  transition: 0.3s all ease-in-out;
}

.expand-enter-from,
.expand-leave-to {
  width: 0 !important;
}
</style>
