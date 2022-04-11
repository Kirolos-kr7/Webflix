<template>
  <Navbar />
  <div
    class="
      flex
      pt-24
      max-w-break
      mx-auto
      p-5
      gap-5
      w-full
      sm:items-center
      justify-between
      flex-col
      sm:flex-row
    "
  >
    <VTitle title="Search" />
    <input
      v-model="inputSearch"
      @keyup.enter="searchNow"
      type="text"
      class="
        border-0
        px-3
        py-2.5
        text-black
        rounded-sm
        outline-none
        font-light
        text-base
        relative
        z-10
        w-full
        sm:w-[400px]
        md:w-[500px]
        lg:w-[600px]
      "
      style="background-image: linear-gradient(#00000020, transparent)"
      placeholder="search a movie, series or a person..."
    />
  </div>
  <div
    class="
      max-w-break
      mx-auto
      grid grid-cols-1
      xs:grid-cols-2
      sm:grid-cols-2
      md:grid-cols-3
      lg:grid-cols-4
      xl:grid-cols-5
      gap-5
      p-5
    "
  >
    <transition-group name="fade" appear>
      <div v-for="show in shows" :key="show.id" class="transition-all">
        <ShowThumbnail :show="show" />
      </div>
    </transition-group>
  </div>
  <transition name="fade" appear>
    <h2 v-if="!shows" class="text-3xl text-center mt-6">
      Type Something to search...
    </h2>
  </transition>
</template>

<script setup>
import { onMounted, ref, watch } from "@vue/runtime-core";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";
import ShowThumbnail from "../components/ShowThumbnail.vue";
import Navbar from "../components/Navbar.vue";
import VTitle from "../components/VTitle.vue";

const shows = ref(),
  router = useRouter(),
  route = useRoute();

watch(route, () => {
  getMode();
  getMovies();
});

onMounted(() => {
  getMode();
  getMovies();
});

const getMovies = async () => {
  if (inputSearch.value) {
    await axios
      .get(
        `https://api.themoviedb.org/3/search/multi?api_key=18cfdbd5b22952a0c5c289fbbf02c827&query=${inputSearch.value}`
      )
      .then((res) => {
        console.log(res.data);
        shows.value = res.data?.results;
      });
  }
};

const getMode = () => {
  inputSearch.value = route.query.query;
};

const inputSearch = ref(null);

const searchNow = async () => {
  let url = new URL(window.location);
  let usp = new URLSearchParams(url);
  usp.set("query", inputSearch.value || "");
  router.push(route.path + "?query=" + usp.get("query"));
  if (!inputSearch.value) shows.value = null;
  getMovies();
};
</script>
