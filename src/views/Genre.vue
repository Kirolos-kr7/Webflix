<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Loader from '../components/Loader.vue'

import VTitle from '../components/VTitle.vue'
import useAxios from '../composables/useAxios'
import type { Genre, Show } from '../types'
import Pagination from '../components/Pagination.vue'
import LoginToContinue from '../components/LoginToContinue.vue'
import ShowThumbnail from '../components/ShowThumbnail.vue'
import useTitle from '../composables/useTitle'

const isLoading = ref<boolean>(false),
  genre = ref<Genre>(),
  shows = ref<Show[]>(),
  page = ref<number>(1),
  totalPages = ref<number>(1),
  litc = ref<boolean>(false),
  resource = ref<string>('movie'),
  router = useRouter(),
  route = useRoute()

onMounted(async () => {
  if (route.path.includes('series')) resource.value = 'series'
  page.value = !isNaN(route.query.p as any) ? parseInt(route.query.p as any) : 1
  getShows()
})

const getShows = async () => {
  isLoading.value = true
  shows.value = []

  let { data: genreList } = await useAxios({
    url: `genre/${resource.value === 'series' ? 'tv' : 'movie'}/list`
  })

  genre.value = genreList.genres.find(
    (genre: Genre) => genre.id.toString() == route.params.id
  )
  useTitle(
    `${genre.value?.name} ${
      resource.value[0].toUpperCase() + resource.value.slice(1)
    } on Webflix`
  )

  let { data } = await useAxios({
    url: `discover/${
      resource.value === 'series' ? 'tv' : resource.value
    }?with_genres=${route.params.id}&page=${page.value}`
  })

  totalPages.value = await data.total_pages
  shows.value = await data.results.map((show: Show) => {
    show.media_type = resource.value === 'series' ? 'tv' : resource.value
    return show
  })
  isLoading.value = false
}

const handlePageChange = (p: number | string) => {
  if (p === '+') page.value++
  else if (p === '-') page.value--
  else if (typeof p == 'number') {
    page.value = p
  } else page.value = 1

  window.scrollTo({ top: 0, behavior: 'smooth' })
  router.push({
    name: resource.value === 'movie' ? 'MovieGenre' : 'SeriesGenre',
    query: { p: page.value !== 1 ? page.value : undefined }
  })

  getShows()
}
</script>

<template>
  <div class="mx-auto flex w-full max-w-break flex-col gap-8 px-5 pt-24">
    <h2
      class="relative z-[2] -mb-8 font-bebasNeue text-lg capitalize tracking-widest text-gray-300"
    >
      {{ resource == 'movie' ? 'movies' : resource }}
    </h2>
    <VTitle v-if="genre" :title="`${genre?.name}`" class="capitalize" />
  </div>

  <Loader v-if="isLoading" />

  <div
    class="mx-auto grid max-w-break grid-cols-1 gap-5 p-5 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
  >
    <transition-group name="fade" appear>
      <div v-for="show in shows" :key="show.id" class="transition-all">
        <ShowThumbnail :show="show" @needToLogin="litc = true" />
      </div>
    </transition-group>
  </div>
  <Pagination
    v-if="!isLoading && shows && shows.length > 0"
    :currPage="page"
    :totalPages="totalPages"
    @pageChange="handlePageChange"
  />

  <LoginToContinue :litc="litc" @closeLitc="litc = false" />
</template>
