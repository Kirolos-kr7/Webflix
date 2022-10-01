<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Navbar from '../components/Navbar.vue'
import useAxios from '../composables/useAxios'
import Loader from '../components/Loader.vue'
import VImage from '../components/VImage.vue'
import type { ShowDetails, Season } from '../types'
import VSvg from '../components/VSvg.vue'
import VDropDown from '../components/VDropDown.vue'

const route = useRoute(),
  router = useRouter(),
  season = ref<Season | null>(),
  selectedSeason = ref<Season | null>(),
  show = ref<ShowDetails | null>(),
  isLoading = ref(false)

onMounted(() => {
  fetchData()
})

watch(route, () => {
  if (route.path.includes('/season/')) {
    fetchData()
  }
})

const fetchData = async () => {
  isLoading.value = true

  let { data: showData, error: showError } = await useAxios({
    url: `tv/${route.params.showId}`
  })

  let { data, error } = await useAxios({
    url: `tv/${route.params.showId}/season/${route.params.seasonNum}`
  })
  if (
    (error && !error.response.data.success) ||
    (showError && !showError.response.data.success)
  )
    return router.replace('/404')

  show.value = showData
  season.value = data
  document.title = `${showData?.name}: ${data?.name}  - Webflix`
  isLoading.value = false
  selectedSeason.value = showData.seasons.find(
    (season: Season) =>
      season.season_number == (route.params.seasonNum as unknown)
  )
}

const changeSeason = (sNum: number) => {
  selectedSeason.value = show.value?.seasons.find(
    (season: Season) => season.season_number == (sNum as unknown)
  )
  router.replace(`/series/${route.params.showId}/season/${sNum}`)
}
</script>

<template>
  <Navbar />

  <Loader v-if="isLoading" />

  <div class="mx-auto w-full max-w-break p-5 pt-24">
    <div v-if="show && season">
      <div class="mb-5 flex flex-wrap justify-between gap-x-4 gap-y-2">
        <button
          class="w-full rounded-md bg-wf-200 px-4 py-1.5 hover:bg-wf-200/70 xs:w-auto"
        >
          <router-link :to="`/series/${show.id}`" class="flex gap-2">
            <VSvg
              class="mt-0.5"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
            ></VSvg>
            Back to {{ show.name }}</router-link
          >
        </button>
        <VDropDown
          class="w-full xs:w-[180px]"
          :options="show?.seasons"
          :selected="selectedSeason"
          textKey="name"
          valueKey="season_number"
          @selectionChange="changeSeason"
        />
      </div>
      <div class="flex flex-col gap-3 sm:flex-row md:px-3">
        <VImage
          v-if="season.poster_path"
          class="mx-auto rounded-md object-cover xs:max-w-[220px] md:mx-px"
          :src="`https://image.tmdb.org/t/p/w300/${season.poster_path}`"
        />
        <div class="flex flex-1 flex-col py-2 md:px-3">
          <h1 class="text-4xl font-semibold">
            {{ show.name }}: {{ season.name }}
          </h1>
          <div v-if="season.overview">
            <h2 class="mt-5 text-xl font-medium">Overview</h2>
            <p class="mt-2 text-gray-400">
              {{ season.overview }}
            </p>
          </div>
        </div>
      </div>

      <div v-if="season.episodes.length > 0" class="py-10">
        <h2 class="text-3xl font-semibold">Episodes</h2>
        <div class="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2">
          <div
            class="relative flex flex-shrink-0 flex-col rounded-md bg-wf-200 p-3 transition-colors xs:flex-row"
            v-for="episode in season.episodes"
            :key="episode.id"
          >
            <VImage
              v-if="episode.still_path"
              class="w-full rounded-md object-cover hover:opacity-70 xs:w-[25%]"
              :src="`https://image.tmdb.org/t/p/w500/${episode.still_path}`"
            />
            <div class="p-3">
              <h1 class="text-lg font-semibold">{{ episode.name }}</h1>
              <p class="mt-2 text-gray-400">{{ episode.overview }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
