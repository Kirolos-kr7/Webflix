<script setup>
import { ref } from "@vue/reactivity";
import { useRouter } from "vue-router";
import axios from "axios";
import { watch } from "@vue/runtime-core";
import VImage from "./VImage.vue";

const props = defineProps(["searchDialog"]),
  emits = defineEmits(["hideSearchDialog"]),
  router = useRouter(),
  inputSearch = ref(""),
  autoFocusInput = ref(),
  resContainer = ref(),
  currIndex = ref(0),
  searchResult = ref([]);

watch(props, () => {
  if (props.searchDialog) {
    setTimeout(() => {
      autoFocusInput.value?.focus();
    }, 100);
  }
});

const searchNow = async (e) => {
  inputSearch.value = e.target.value;

  currIndex.value = 0;
  if (inputSearch.value === "") {
    searchResult.value = [];
    return;
  }
  await axios
    .get(
      `https://api.themoviedb.org/3/search/multi?api_key=18cfdbd5b22952a0c5c289fbbf02c827&query=${inputSearch.value}`
    )
    .then((res) => {
      searchResult.value = res.data?.results.splice(0, 5);
    });
};

const handleArrows = (e) => {
  let itemsLength = resContainer.value?.children.length - 1;

  if (itemsLength <= 0 || !searchResult.value) return;

  if (currIndex.value >= 0)
    resContainer.value.children[currIndex.value].classList.remove(
      "!bg-darkblue-200"
    );

  if (e.key === "ArrowUp")
    if (currIndex.value == 0) currIndex.value = itemsLength;
    else if (currIndex.value > 0) currIndex.value--;

  if (e.key === "ArrowDown")
    if (currIndex.value == itemsLength) currIndex.value = 0;
    else if (currIndex.value < itemsLength) currIndex.value++;

  resContainer.value.children[currIndex.value].classList.add(
    "!bg-darkblue-200"
  );
};

const toShow = () => {
  if (searchResult.value.length == 0) return;
  if (resContainer.value?.children.length > searchResult.value.length)
    router.push("/404");

  if (navigator.userAgentData.mobile)
    router.push(`/search?query=${inputSearch.value}`);
  else {
    let result = searchResult.value[currIndex.value];

    if (result)
      result.media_type === "person"
        ? router.push(`/person/${result.id}`)
        : result.media_type === "movie"
        ? router.push(`/movie/${result.id}`)
        : result.media_type === "tv"
        ? router.push(`/series/${result.id}`)
        : router.push("/404");
    else router.push(`/search?query=${inputSearch.value}`);
  }

  exit();
};

const exit = () => {
  inputSearch.value = null;
  searchResult.value = [];
  emits("hideSearchDialog");
};
</script>

<template>
  <transition name="fadeIn">
    <div
      class="w-full min-h-screen bg-transparent fixed inset-0 z-40 backdrop-blur-sm"
      v-if="searchDialog"
    >
      <div
        class="w-full h-full bg-black/60 absolute inset-0 transition-all"
        @click="exit"
      ></div>
      <div
        class="relative z-[41] w-11/12 sm:w-[400px] md:w-[500px] lg:w-[600px] mx-auto mt-32 flex flex-col items-center"
      >
        <h2 class="text-4xl font-semibold text-left w-full mb-2">Search</h2>
        <div class="flex items-center w-full">
          <input
            :value="inputSearch"
            @keyup.enter="toShow"
            @keyup="handleArrows"
            @input="searchNow($event)"
            ref="autoFocusInput"
            type="text"
            class="w-full border-0 px-3 py-2.5 text-black rounded-sm outline-none font-light text-base"
            style="background-image: linear-gradient(#00000020, transparent)"
            placeholder="search a movie, series or a person..."
          />
        </div>
        <div v-if="searchResult" class="w-full" ref="resContainer">
          <router-link
            v-for="result in searchResult"
            :key="result.id"
            class="bg-darkblue-200/80 hover:bg-darkblue-300/80 w-full flex items-center overflow-hidden"
            :to="
              result.media_type === 'person'
                ? `/person/${result.id}`
                : result.media_type === 'movie'
                ? `/movie/${result.id}`
                : result.media_type === 'tv'
                ? `/series/${result.id}`
                : '/404'
            "
            @click="exit"
          >
            <VImage
              v-if="result.media_type === 'person' && result.profile_path"
              :src="`https://image.tmdb.org/t/p/w200/${result.profile_path}`"
              class="h-16 object-cover w-[43px]"
            />
            <VImage
              v-else-if="result.poster_path"
              :src="`https://image.tmdb.org/t/p/w200/${result.poster_path}`"
              class="h-16 object-cover w-[43px]"
            />
            <VImage v-else src="/broken.png" class="h-16 object-cover" />

            <span class="p-3 truncate"> {{ result.name || result.title }}</span>
          </router-link>
          <router-link
            :to="{ name: 'search', query: { query: inputSearch } }"
            v-if="searchResult?.length > 0"
            class="bg-darkblue-300 hover:bg-darkblue-100 p-3 w-full rounded-b-md block"
          >
            Watch More
          </router-link>
        </div>
      </div>
      <button
        @click="exit"
        class="p-3 rounded-sm bg-red-600 hover:bg-red-500 absolute right-5 top-5"
      >
        <svg
          class="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd"
          ></path>
        </svg>
      </button>
    </div>
  </transition>
</template>
