<script setup>
import { ref, onMounted, watch } from 'vue'
import Search from './Search.vue'
import { useRoute } from 'vue-router'
import { useStore } from '../store'

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
})

const searchDialog = ref(false)

const showSearchDialog = () => {
  searchDialog.value = true
}

const hideSearchDialog = () => {
  searchDialog.value = false
}
</script>

<template>
  <nav class="fixed top-0 z-30 w-full px-5 pt-3 pb-2 transition-all" ref="nav">
    <div class="mx-auto flex w-full max-w-break items-center justify-between">
      <div class="flex items-center gap-5">
        <router-link
          to="/"
          class="clear text-5xl text-green-300 transition-colors hover:text-green-400 md:text-6xl"
          style="font-family: 'Bebas Neue'"
          >WEBFLIX</router-link
        >
        <ul class="flex items-center gap-5">
          <li
            v-for="item in listItems"
            :key="item.title"
            class="hidden md:block"
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
      <ul class="relative z-30 mb-2 flex items-center gap-x-3 text-gray-300">
        <li class="-mb-2" v-if="route.name !== 'search'">
          <button
            @click="showSearchDialog"
            class="mb-2 text-green-300 transition-colors hover:text-green-500"
          >
            <svg
              class="h-7 w-7"
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
          </button>
        </li>
        <li class="-mb-2">
          <button
            class="mb-2 text-green-300 transition-colors hover:text-green-500 md:hidden"
            ref="hamButton"
            @click="navOpen = !navOpen"
          >
            <svg
              class="h-9 w-9"
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

        <li>
          <button class="h-10 w-10 rounded-full object-cover shadow-lg">
            <img
              class="h-10 w-10 rounded-full object-cover"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ79GjtRSlnYnEiHzWrOj29US2HRtXI_olH1A&usqp=CAU"
              alt=""
            />
          </button>
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
