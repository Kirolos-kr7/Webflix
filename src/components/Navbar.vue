<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue'
import type { Ref } from 'vue'
import Search from './Search.vue'
import { useRoute } from 'vue-router'
import type { ListItem } from '../types'
import { useStore } from '../store'
import { supabase } from '../supabase'
import vTooltip from '../composables/useTooltip'
import VButton from './VButton.vue'
import VImage from './VImage.vue'
import VSvg from './VSvg.vue'

const listItems: Ref<ListItem[]> = ref([
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
    },
    {
      title: 'Genres',
      path: 'genres'
    }
  ]),
  isNavTransparent = ref(true),
  navOpen = ref(false),
  optionsMenu = ref(false),
  nav = ref<HTMLInputElement | null>(null),
  store = useStore(),
  route = useRoute()

watch(navOpen, () => {
  if (navOpen.value) document.body.style.overflow = 'hidden'
  else document.body.style.overflow = 'overlay'
})

const handleNavbarScroll = () => {
  if (route.name !== 'AMovie' && route.name !== 'ASeries')
    isNavTransparent.value = false

  if (window.scrollY > 500) isNavTransparent.value = false
  else isNavTransparent.value = true
}

onMounted(() => {
  window.addEventListener('scroll', () => handleNavbarScroll())
  window.addEventListener('keydown', (e) => handleSearchShortcuts(e))
})

onUnmounted(() => {
  window.removeEventListener('scroll', () => handleNavbarScroll())
  window.removeEventListener('keydown', (e) => handleSearchShortcuts(e))
})

const searchDialog = ref(false)

const showSearchDialog = () => {
  searchDialog.value = true
}

const hideSearchDialog = () => {
  searchDialog.value = false
}

const handleSearchShortcuts = (e: KeyboardEvent) => {
  if ((e.ctrlKey && e.key === 'k') || e.key === '/') {
    e.preventDefault()
    searchDialog.value = !searchDialog.value
  }
}

const toggleOptionsMenu = () => {
  if (!optionsMenu.value) {
    window.addEventListener(
      'mouseup',
      (e: MouseEvent) => {
        if ((e.target as HTMLElement).dataset.optionsmenu === 'x') return
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

const skipNav = () => {
  let skipper = document.querySelector('.skipper') as HTMLButtonElement
  skipper.focus()
}
</script>

<template>
  <nav
    class="fixed top-0 z-30 w-full px-5 pt-3 pb-2 transition-all"
    ref="nav"
    :class="!isNavTransparent ? 'bg-wf-300/80 backdrop-blur-lg' : ''"
  >
    <div class="mx-auto flex w-full max-w-break items-center justify-between">
      <button
        class="absolute -top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 rounded-sm bg-wf-100 px-3 py-2 outline-none transition-all focus-visible:top-1/2 focus-visible:ring"
        @click="skipNav"
      >
        Skip Navigation
      </button>

      <div class="flex items-center gap-5">
        <ul class="flex items-center gap-2">
          <li class="-mb-2 md:hidden">
            <button
              class="mb-2 rounded-sm text-green-300 outline-none transition-colors hover:text-green-500 focus-visible:ring-2"
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
            class="clear -mx-1 -mt-1 rounded-sm px-1.5 pt-1.5 font-bebasNeue text-5xl text-green-300 outline-none transition-colors hover:text-green-400 focus-visible:ring-2 md:text-6xl"
            >WEBFLIX</router-link
          >
          <li
            v-for="item in listItems"
            :key="item.title"
            class="ml-2 mb-1 hidden md:flex"
          >
            <router-link
              @click="navOpen = false"
              :to="`/${item.path}`"
              class="green-link -mx-1 rounded-sm px-1 text-xl outline-none focus-visible:ring-2"
              >{{ item.title }}</router-link
            >
          </li>
        </ul>
      </div>
      <ul class="relative z-30 mb-1 flex items-center gap-3 text-gray-300">
        <li
          class="-mb-2"
          v-if="route.name !== 'search'"
          v-tooltip.center="`Search Shows`"
        >
          <button
            @click="showSearchDialog"
            class="group mb-2 flex items-center gap-2 rounded-md p-1 outline-none focus-visible:ring-2 md:p-2"
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
          <div class="relative -mb-2">
            <button
              data-optionsMenu="x"
              @click="toggleOptionsMenu()"
              class="h-12 w-12 rounded-full shadow-lg outline-none focus:ring-2"
            >
              <VImage
                class="h-12 w-12 rounded-full"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ79GjtRSlnYnEiHzWrOj29US2HRtXI_olH1A&usqp=CAU"
              />
            </button>
            <transition name="fade">
              <div
                v-if="optionsMenu"
                class="absolute top-14 right-0 w-[280px] rounded-md bg-wf-200 shadow-xl"
              >
                <ul
                  class="overflow-hidden rounded-md [&>*>a:hover]:bg-wf-100 [&>*>a]:flex [&>*>a]:w-full [&>*>a]:items-center [&>*>a]:gap-1 [&>*>a]:bg-wf-200 [&>*>a]:px-3 [&>*>a]:py-1.5 [&>*>a]:text-left [&>*>a]:!text-white [&>*>a]:ring-inset [&>*>a:focus]:outline-none [&>*>a:focus]:ring-2 [&>*:first-child>a]:rounded-t-md [&>*:last-child>a]:rounded-b-md"
                >
                  <li>
                    <router-link
                      to="/me"
                      class="truncate border-b border-wf-100/50 !py-3"
                    >
                      <VSvg
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      />
                      @{{ store.user.user_metadata.name }}
                    </router-link>
                  </li>
                  <li>
                    <router-link to="/me/fav">
                      <VSvg
                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      />
                      Favourite
                    </router-link>
                  </li>
                  <li>
                    <router-link
                      to="/"
                      @click="logout()"
                      class="flex items-center gap-1 !bg-red-900 hover:!bg-red-800"
                    >
                      <VSvg
                        d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z"
                      />
                      Logout
                    </router-link>
                  </li>
                </ul>
              </div>
            </transition>
          </div>
        </li>
        <li v-else>
          <VButton
            to="/auth"
            class="outline-none ring-emerald-600 ring-offset-1 ring-offset-wf-300 focus-within:ring"
            >Login</VButton
          >
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
              <router-link
                class="block px-5 py-3 outline-none ring-inset focus-visible:ring-2"
                :to="`/${item.path}`"
                >{{ item.title }}</router-link
              >
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
