<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter, type RouteLocationNormalized } from 'vue-router'
import Navbar from '../components/Navbar.vue'
import Pagination from '../components/Pagination.vue'
import ShowThumbnail from '../components/ShowThumbnail.vue'
import VTitle from '../components/VTitle.vue'
import useAxios from '../composables/useAxios'
import LoginToContinue from './LoginToContinue.vue'
import vTooltip from '../composables/useTooltip'
import Loader from './Loader.vue'
import type { ShowMode, Show } from '../types'

const shows = ref<Show[]>(),
  page = ref<number>(1),
  totalPages = ref<number>(1),
  router = useRouter(),
  route: RouteLocationNormalized = useRoute(),
  litc = ref<boolean>(false),
  isFetching = ref<boolean>(false)

const props = defineProps<{
  name: string
  resource: string
  showModes: ShowMode[]
}>()

const currmode = computed(() => {
  let modeExists = props?.showModes.filter(
    (show) => show.mode === route.query.mode
  )

  return modeExists[0]?.mode ? modeExists[0].mode : props?.showModes[0].mode
})

watch(route, () => getShows())

onMounted(async () => {
  document.title = `${props.name} on Webflix`
  page.value = !isNaN(route.query.p as any) ? parseInt(route.query.p as any) : 1
  getShows()
})

const getShows = async () => {
  isFetching.value = true
  shows.value = []

  let { data } = await useAxios({
    url: `${props.resource}/${currmode.value}${
      props.name === 'Trending' ? '/week' : ''
    }?page=${page.value}`
  })

  totalPages.value = await data.total_pages
  if (props.resource !== 'trending')
    shows.value = await data.results.map((show: Show) => {
      show.media_type = props.resource
      return show
    })
  else shows.value = await data.results
  isFetching.value = false
}

const handlePageChange = (p: number | string) => {
  if (p === '+') return page.value++
  if (p === '-') return page.value--
  page.value = typeof p === 'number' ? p : 0
  window.scrollTo({ top: 0, behavior: 'smooth' })
  router.push({
    name: props.name,
    query: { mode: currmode.value, p: p !== 1 ? p : undefined }
  })
  getShows()
}

const changeMode = (newMode: string) => {
  page.value = 1

  router.push({
    name: props.name,
    query: {
      mode: newMode !== props.showModes[0].mode ? newMode : undefined
    }
  })
}
</script>

<template>
  <Navbar />
  <div
    class="mx-auto flex w-full max-w-break items-center justify-between px-5 pt-24"
  >
    <VTitle :title="name" />
    <div
      class="relative z-[1] hidden overflow-hidden rounded-md md:flex"
      v-tooltip="`Filter Shows`"
    >
      <button
        v-for="{ title, mode } in showModes"
        :key="mode"
        class="bg-wf-200 px-3 pt-1.5 pb-1 text-sm transition-colors hover:bg-wf-100/80"
        :class="currmode === mode ? 'bg-green-600 hover:!bg-green-800' : ''"
        @click="changeMode(mode)"
      >
        {{ title }}
      </button>
    </div>
    <select
      :value="currmode"
      class="relative z-[1] flex rounded-sm bg-wf-200/50 px-2 py-1 text-sm text-white outline-none md:hidden"
      @change="changeMode(($event.target as HTMLSelectElement).value)"
    >
      <option v-for="{ title, mode } in showModes" :key="mode" :value="mode">
        {{ title }}
      </option>
    </select>
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