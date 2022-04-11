<template>
  <Navbar />
  <div
    class="flex pt-24 max-w-break mx-auto p-5 w-full items-center justify-between"
  >
    <VTitle title="Movies" />
    <div class="rounded-md overflow-hidden hidden md:flex relative z-[1]">
      <button
        v-for="by in showModes"
        :key="by"
        class="px-3 py-1.5 bg-darkblue-200 hover:bg-darkblue-100/80 transition-colors text-sm"
        :class="by.mode === mode ? 'bg-green-600 hover:!bg-green-800' : ''"
        @click="changeMode(by.mode)"
      >
        {{ by.title }}
      </button>
    </div>
    <select
      v-model="mode"
      class="text-white bg-darkblue-200/50 px-2 py-1 rounded-sm md:hidden flex text-sm outline-none relative z-[1]"
      ref="selectMode"
      @change="changeMode()"
    >
      <option v-for="by in showModes" :key="by" :value="by.mode">
        {{ by.title }}
      </option>
    </select>
  </div>
  <div
    ref="cnt"
    class="max-w-break mx-auto grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 p-5"
  >
    <transition-group name="fade" appear>
      <div v-for="show in shows" :key="show.id" class="transition-all">
        <ShowThumbnail :show="show" />
      </div>
    </transition-group>
    <span class="m-6" v-if="isFetching">loading...</span>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "@vue/runtime-core";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";
import ShowThumbnail from "../components/ShowThumbnail.vue";
import Navbar from "../components/Navbar.vue";
import VTitle from "../components/VTitle.vue";

const shows = ref([]),
  page = ref(1),
  router = useRouter(),
  route = useRoute(),
  mode = ref(""),
  cnt = ref(),
  isFetching = ref(false),
  selectMode = ref(""),
  showModes = ref([
    { mode: "popular", title: "Popular" },
    { mode: "now_playing", title: "Now Playing" },
    { mode: "top_rated", title: "Top Rated" },
    { mode: "upcoming", title: "Upcoming" },
  ]);

watch(route, () => {
  getMode();
  getMovies();
});

onMounted(async () => {
  document.title = `Movies on Webflix`;
  getMode();
  getMovies();

  window.addEventListener("scroll", async (e) => {
    if (
      cnt.value?.getBoundingClientRect().bottom <= 700 &&
      isFetching.value != true
    ) {
      getMovies();
    }
  });
});

const getMovies = async () => {
  isFetching.value = true;
  let { data } = await axios.get(
    `https://api.themoviedb.org/3/movie/${mode.value}?api_key=18cfdbd5b22952a0c5c289fbbf02c827&page=${page.value}`
  );
  await data.results.forEach((show) => {
    show.media_type = "movie";
    shows.value.push(show);
    page.value += 1;
  });
  isFetching.value = false;
};

const getMode = () => {
  let isFound = false;
  showModes.value.forEach((by) => {
    if (by.mode === route.query.mode) {
      isFound = true;
    }
  });

  if (isFound) mode.value = route.query.mode;
  else {
    mode.value = "popular";
    router.push(route.path);
  }
};

const changeMode = (x) => {
  shows.value = [];
  page.value = 1;
  if (!x) x = selectMode.value.value;
  let url = new URL(window.location);
  let usp = new URLSearchParams(url);
  usp.set("mode", x);
  router.push(route.path + "?mode=" + usp.get("mode"));
};
</script>
