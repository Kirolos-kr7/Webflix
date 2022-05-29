<template>
  <Navbar />
  <div
    class="flex pt-24 max-w-break mx-auto p-5 gap-5 w-full sm:items-center justify-between flex-col sm:flex-row"
  >
    <VTitle title="Search" />
    <input
      v-model="inputSearch"
      @input="searchNow"
      type="text"
      class="border-0 px-3 py-2.5 text-black rounded-sm outline-none font-light text-base relative z-10 w-full sm:w-[400px] md:w-[500px] lg:w-[600px]"
      style="background-image: linear-gradient(#00000020, transparent)"
      placeholder="search a movie, series or a person..."
    />
  </div>
  <div
    class="max-w-break mx-auto grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 p-5"
  >
    <transition-group name="fade" appear>
      <ShowThumbnail v-for="show in shows" :key="show.id" :show="show" />
    </transition-group>
  </div>
  <transition name="fade" appear>
    <h2 v-if="!shows.length > 0" class="text-3xl text-center mt-6">
      {{
        inputSearch.trim() !== ""
          ? `No result found for "${inputSearch}"`
          : "Type Something to search..."
      }}
    </h2>
  </transition>
</template>

<script setup>
import { onMounted, ref } from "@vue/runtime-core";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";
import ShowThumbnail from "../components/ShowThumbnail.vue";
import Navbar from "../components/Navbar.vue";
import VTitle from "../components/VTitle.vue";

const shows = ref([]),
  router = useRouter(),
  route = useRoute(),
  inputSearch = ref("");

onMounted(async () => {
  inputSearch.value = route.query.query || "";
  router.replace({ name: "search", query: { query: inputSearch.value } });
  await getMovies();
});

const getMovies = async () => {
  if (inputSearch.value.trim() !== "") {
    await axios
      .get(
        `https://api.themoviedb.org/3/search/multi?api_key=18cfdbd5b22952a0c5c289fbbf02c827&query=${inputSearch.value}`
      )
      .then((res) => {
        shows.value = res.data?.results;
      });
  }
};

const searchNow = async () => {
  if (inputSearch.value === "") {
    router.replace({ name: "search", query: null });
    shows.value = [];
    return;
  }
  router.replace({ name: "search", query: { query: inputSearch.value } });
  getMovies();
};
</script>
