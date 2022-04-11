<script setup>
import { ref } from "@vue/reactivity";
import { onMounted, watch } from "@vue/runtime-core";
import Search from "./Search.vue";
import { useRoute } from "vue-router";

const listItems = ref([
    {
      title: "Trending",
      path: "",
    },
    {
      title: "Movies",
      path: "movies",
    },
    {
      title: "Series",
      path: "series",
    },
  ]),
  navOpen = ref(false),
  nav = ref(),
  route = useRoute();

watch(navOpen, () => {
  if (navOpen.value) document.body.style.overflow = "hidden";
  else document.body.style.overflow = "overlay";
});

onMounted(() => {
  if (
    route.path === "/" ||
    route.path === "/movies" ||
    route.path === "/series"
  ) {
    nav.value?.classList.add("bg-darkblue-300/80");
    nav.value?.classList.add("backdrop-blur-lg");
  } else {
    window.addEventListener("scroll", (e) => {
      if (window.scrollY > 500) {
        nav.value?.classList.add("bg-darkblue-300/80");
        nav.value?.classList.add("backdrop-blur-lg");
      } else {
        nav.value?.classList.remove("bg-darkblue-300/80");
        nav.value?.classList.remove("backdrop-blur-lg");
      }
    });
  }
});

const searchDialog = ref(false);

const showSearchDialog = () => {
  searchDialog.value = true;
};

const hideSearchDialog = () => {
  searchDialog.value = false;
};
</script>

<template>
  <nav class="px-5 pt-3 pb-2 fixed top-0 z-30 w-full transition-all" ref="nav">
    <div class="mx-auto flex items-center justify-between max-w-break w-full">
      <router-link
        to="/"
        class="text-5xl md:text-6xl text-green-300 hover:text-green-400 clear transition-colors"
        style="font-family: 'Bebas Neue'"
        >WEBFLIX</router-link
      >
      <ul class="hidden md:flex gap-x-3 items-center text-gray-300 mb-2">
        <li class="-mb-2">
          <button @click="showSearchDialog">
            <svg
              class="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </button>
        </li>
        <li v-for="item in listItems" :key="item.title">
          <router-link
            @click="navOpen = false"
            :to="`/${item.path}`"
            class="text-lg transition-colors hover:text-gray-400"
            >{{ item.title }}</router-link
          >
        </li>
      </ul>
      <div class="flex gap-x-3 md:hidden">
        <button @click="showSearchDialog" class="mb-2 text-green-300 z-30">
          <svg
            class="w-7 h-7"
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
        <button
          class="mb-2 text-green-300 z-30"
          ref="hamButton"
          @click="navOpen = !navOpen"
        >
          <svg
            class="w-9 h-9"
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
      </div>
      <div
        v-if="navOpen"
        class="fixed top-0 left-0 h-screen w-screen"
        @click="navOpen = false"
      ></div>
      <transition name="expand">
        <div
          v-if="navOpen"
          ref="overlayMenu"
          class="bg-darkblue-200 z-20 fixed top-0 right-0 min-h-screen w-9/12 overflow-hidden transition-all duration-300"
        >
          <ul
            class="flex flex-col divide-y divide-gray-700 justify-end items-end text-gray-300 mb-2 mt-20 transition-opacity"
            :class="navOpen ? '' : 'opacity-0'"
          >
            <li
              v-for="item in listItems"
              :key="item.title"
              class="w-full text-2xl font-medium transition-colors hover:bg-darkblue-300"
            >
              <router-link class="px-5 py-3 block" :to="`/${item.path}`">{{
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
