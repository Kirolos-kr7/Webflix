<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Loader from '../components/Loader.vue'
import Navbar from '../components/Navbar.vue'
import VTitle from '../components/VTitle.vue'
import useAxios from '../composables/useAxios'
import type { Network, Show } from '../types'
import Pagination from '../components/Pagination.vue'
import LoginToContinue from '../components/LoginToContinue.vue'
import ShowThumbnail from '../components/ShowThumbnail.vue'
import VImage from '../components/VImage.vue'

const isFetching = ref<boolean>(false),
  network = ref<Network>(),
  shows = ref<Show[]>(),
  page = ref<number>(1),
  totalPages = ref<number>(1),
  litc = ref<boolean>(false),
  router = useRouter(),
  route = useRoute()

onMounted(async () => {
  page.value = !isNaN(route.query.p as any) ? parseInt(route.query.p as any) : 1
  getShows()
})

const getShows = async () => {
  isFetching.value = true
  shows.value = []

  let { data: _network } = await useAxios({
    url: `network/${route.params.id}`
  })

  network.value = _network

  let { data } = await useAxios({
    url: `discover/tv?with_networks=${_network.id}&page=${page.value}`
  })

  totalPages.value = await data.total_pages
  shows.value = await data.results.map((show: Show) => {
    show.media_type = 'tv'
    return show
  })
  isFetching.value = false
}

const handlePageChange = (p: number | string) => {
  if (p === '+') return page.value++
  else if (p === '-') return page.value--
  else if (typeof p === 'number') {
    page.value = p as number
  } else page.value = 1

  window.scrollTo({ top: 0, behavior: 'smooth' })
  router.push({
    name: 'Network',
    query: { p: page.value !== 1 ? page.value : undefined }
  })

  getShows()
}
</script>

<template>
  <Navbar />
  <div class="mx-auto flex w-full max-w-break flex-col gap-8 px-5 pt-24">
    <h2
      class="relative z-[2] -mb-8 font-bebasNeue text-lg capitalize tracking-widest text-gray-300"
    >
      Network
    </h2>
    <VImage
      v-if="network && network.logo_path"
      class="mt-2 w-[230px] sm:w-[300px]"
      :src="`https://image.tmdb.org/t/p/w300/${network.logo_path}`"
      :title="network.name"
    />
  </div>

  <Loader v-if="isFetching" />

  <div
    class="mx-auto grid max-w-break grid-cols-1 gap-5 p-5 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
  >
    <transition-group name="fade" appear>
      <div v-for="show in shows" :key="show.id" class="transition-all">
        <ShowThumbnail
          :show="show"
          @needToLogin="litc = true"
          :isFluid="true"
        />
      </div>
    </transition-group>
  </div>
  <Pagination
    v-show="shows && shows.length > 0"
    :currPage="page"
    :totalPages="totalPages"
    @pageChange="handlePageChange"
  />

  <LoginToContinue :litc="litc" @closeLitc="litc = false" />
</template>
