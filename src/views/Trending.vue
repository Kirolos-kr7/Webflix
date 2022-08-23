<template>
  <Navbar />
  <div
    class="mx-auto flex w-full max-w-break items-center justify-between p-5 pt-24"
  >
    <VTitle title="Trending" />
    <div class="relative z-[1] hidden overflow-hidden rounded-md md:flex">
      <button
        v-for="by in showModes"
        :key="by"
        class="bg-darkblue-200 px-3 py-1.5 text-sm transition-colors hover:bg-darkblue-100/80"
        :class="by.mode === mode ? 'bg-green-600 hover:!bg-green-800' : ''"
        @click="changeMode(by.mode)"
      >
        {{ by.title }}
      </button>
    </div>
    <select
      :value="mode"
      class="relative z-[1] flex rounded-sm bg-darkblue-200/50 px-2 py-1 text-sm text-white outline-none md:hidden"
      @change="changeMode($event.target.value)"
    >
      <option v-for="by in showModes" :key="by" :value="by.mode">
        {{ by.title }}
      </option>
    </select>
  </div>
  <div
    class="mx-auto grid max-w-break grid-cols-1 gap-5 p-5 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
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
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Navbar from '../components/Navbar.vue'
import Pagination from '../components/Pagination.vue'
import ShowThumbnail from '../components/ShowThumbnail.vue'
import VTitle from '../components/VTitle.vue'
import useAxios from '../composables/useAxios'

const shows = ref([]),
  page = ref(1),
  totalPages = ref(1),
  router = useRouter(),
  route = useRoute(),
  isFetching = ref(false),
  showModes = ref([
    { mode: 'all', title: 'All' },
    { mode: 'movie', title: 'Movie' },
    { mode: 'tv', title: 'TV' }
  ])

const mode = computed(() => {
  let modeExists = showModes.value.filter(
    (show) => show.mode === route.query.mode
  )

  return modeExists[0]?.mode ? modeExists[0].mode : showModes.value[0].mode
})

watch(route, () => getMovies())

onMounted(async () => {
  document.title = `Series on Webflix`
  page.value = !isNaN(route.query.p) ? parseInt(route.query.p) : 1
  getMovies()
})

const getMovies = async () => {
  isFetching.value = true
  shows.value = []

  let { data } = await useAxios({
    url: `trending/${mode.value}/week?api_key=18cfdbd5b22952a0c5c289fbbf02c827&page=${page.value}`
  })

  totalPages.value = await data.total_pages
  shows.value = await data.results
  isFetching.value = false
}

const handlePageChange = (p) => {
  if (p === '+') return page.value++
  if (p === '-') return page.value--
  page.value = p
  window.scrollTo({ top: 0, behavior: 'smooth' })
  router.push({
    name: 'Trending',
    query: { mode: mode.value, p: p !== 1 ? p : undefined }
  })
  getMovies()
}

const changeMode = (newMode) => {
  page.value = 1

  router.push({
    name: 'Trending',
    query: {
      mode: newMode !== showModes.value[0].mode ? newMode : undefined
    }
  })
}
</script>
