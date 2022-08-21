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
      :value="mode"
      class="text-white bg-darkblue-200/50 px-2 py-1 rounded-sm md:hidden flex text-sm outline-none relative z-[1]"
      @change="changeMode($event.target.value)"
    >
      <option v-for="by in showModes" :key="by" :value="by.mode">
        {{ by.title }}
      </option>
    </select>
  </div>
  <div
    class="max-w-break mx-auto grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 p-5"
  >
    <transition-group name="fade" appear>
      <div v-for="show in shows" :key="show.id" class="transition-all">
        <ShowThumbnail :show="show" />
      </div>
    </transition-group>
  </div>
  <Pagination
    v-show="shows.length > 0"
    :currPage="page"
    :totalPages="totalPages"
    @pageChange="handlePageChange"
  />
  <span class="m-6" v-if="isFetching">loading...</span>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "@vue/runtime-core";
import { useRoute, useRouter } from "vue-router";
import Navbar from "../components/Navbar.vue";
import Pagination from "../components/Pagination.vue";
import ShowThumbnail from "../components/ShowThumbnail.vue";
import VTitle from "../components/VTitle.vue";
import useAxios from "../composables/useAxios";

const shows = ref([]),
  page = ref(1),
  totalPages = ref(1),
  router = useRouter(),
  route = useRoute(),
  isFetching = ref(false),
  showModes = ref([
    { mode: "popular", title: "Popular" },
    { mode: "now_playing", title: "Now Playing" },
    { mode: "top_rated", title: "Top Rated" },
    { mode: "upcoming", title: "Upcoming" },
  ]);

const mode = computed(() => {
  let modeExists = showModes.value.filter(
    (show) => show.mode === route.query.mode
  );

  return modeExists[0]?.mode ? modeExists[0].mode : showModes.value[0].mode;
});

watch(route, () => getMovies());

onMounted(async () => {
  document.title = `Movies on Webflix`;
  page.value = !isNaN(route.query.p) ? parseInt(route.query.p) : 1
  getMovies();
});

const getMovies = async () => {
  isFetching.value = true;
  shows.value = [];

  let { data } = await useAxios({
    url: `movie/${mode.value}?api_key=18cfdbd5b22952a0c5c289fbbf02c827&page=${page.value}`,
  });

  totalPages.value = await data.total_pages;
  shows.value = await data.results.map((show) => {
    show.media_type = "movie";
    return show;
  });
  isFetching.value = false;
};

const handlePageChange = (p) => {
  if (p === "+") return page.value++;
  if (p === "-") return page.value--;
  page.value = p;
  window.scrollTo({ top: 0, behavior: "smooth" });
  router.push({
    name: "Movies",
    query: { mode: mode.value, p: p !== 1 ? p : undefined },
  });
  getMovies();
};

const changeMode = (newMode) => {
  page.value = 1;

  router.push({
    name: "Movies",
    query: {
      mode: newMode !== showModes.value[0].mode ? newMode : undefined,
    },
  });
};
</script>
