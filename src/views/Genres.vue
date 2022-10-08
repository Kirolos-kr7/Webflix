<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Loader from '../components/Loader.vue'
import Navbar from '../components/Navbar.vue'
import VTitle from '../components/VTitle.vue'
import useAxios from '../composables/useAxios'
import type { Genre } from '../types'

const isFetching = ref<boolean>(false),
  movieGenres = ref<Genre[]>(),
  seriesGenres = ref<Genre[]>()

onMounted(async () => {
  isFetching.value = true
  let { data: movieList } = await useAxios({ url: 'genre/movie/list' })
  let { data: tvList } = await useAxios({ url: 'genre/tv/list' })
  movieGenres.value = movieList.genres
  seriesGenres.value = tvList.genres
  isFetching.value = false
})
</script>

<template>
  <Navbar />
  <div
    class="mx-auto flex w-full max-w-break items-center justify-between gap-8 px-5 pt-24"
  >
    <VTitle title="Genres" />
  </div>

  <Loader v-if="isFetching" />

  <div class="relative mx-auto grid max-w-break gap-5 p-5 md:grid-cols-2">
    <div>
      <h2 class="text-2xl font-semibold">Movies</h2>
      <div class="mt-3 grid grid-cols-2 gap-3 text-center lg:grid-cols-3">
        <router-link
          class="genre"
          v-for="{ name, id } in movieGenres"
          :to="`/genre/movies/${id}`"
          >{{ name }}</router-link
        >
      </div>
    </div>
    <div>
      <h2 class="text-2xl font-semibold">Series</h2>
      <div class="mt-3 grid grid-cols-2 gap-3 text-center lg:grid-cols-3">
        <router-link
          class="genre"
          v-for="{ name, id } in seriesGenres"
          :to="`/genre/series/${id}`"
          >{{ name }}</router-link
        >
      </div>
    </div>
  </div>
</template>

<style scoped>
.genre {
  @apply flex items-center justify-center rounded-md bg-wf-200 py-4 px-2 transition-colors hover:bg-wf-200/80;
}
</style>