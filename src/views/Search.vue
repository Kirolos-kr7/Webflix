<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Navbar from '../components/Navbar.vue'
import ShowThumbnail from '../components/ShowThumbnail.vue'
import VTitle from '../components/VTitle.vue'
import useAxios from '../composables/useAxios'
import useTitle from '../composables/useTitle'
import type { Show } from '../types'

useTitle('Searching on Webflix')

const shows = ref<Show[]>([]),
  router = useRouter(),
  route = useRoute(),
  inputSearch = ref<string>('')

onMounted(async () => {
  inputSearch.value =
    typeof route.query.query == 'string' ? route.query.query : ''
  router.replace({
    name: route.name as string,
    query: { query: inputSearch.value }
  })
  await getMovies()
})

const getMovies = async () => {
  if (inputSearch.value.trim() !== '') {
    let { data } = await useAxios({
      url: `search/multi?query=${inputSearch.value}`
    })
    shows.value = data.results
  }
}

const searchNow = async () => {
  if (inputSearch.value === '') {
    router.replace({ name: route.name as string, query: undefined })
    shows.value = []
    return
  }
  router.replace({
    name: route.name as string,
    query: { query: inputSearch.value }
  })
  getMovies()
}
</script>

<template>
  <Navbar />
  <div
    class="mx-auto flex w-full max-w-break flex-col justify-between gap-5 p-5 pt-24 sm:flex-row sm:items-center"
  >
    <VTitle title="Search" />
    <input
      v-model="inputSearch"
      @input="searchNow"
      type="text"
      class="relative z-10 w-full rounded-sm border-0 px-3 py-2.5 text-base font-light text-black outline-none sm:w-[400px] md:w-[500px] lg:w-[600px]"
      style="background-image: linear-gradient(#00000020, transparent)"
      placeholder="search a movie, series or a person..."
    />
  </div>
  <div
    class="mx-auto grid max-w-break grid-cols-1 gap-5 p-5 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
  >
    <transition-group name="fade" appear>
      <ShowThumbnail v-for="show in shows" :key="show.id" :show="show" />
    </transition-group>
  </div>
  <transition name="fade" appear>
    <h2 v-if="shows.length === 0" class="mt-6 text-center text-3xl">
      {{
        inputSearch.trim() !== ''
          ? `No result found for "${inputSearch}"`
          : 'Type Something to search...'
      }}
    </h2>
  </transition>
</template>
