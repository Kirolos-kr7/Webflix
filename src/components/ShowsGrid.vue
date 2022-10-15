<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter, type RouteLocationNormalized } from 'vue-router'
import Navbar from '../components/Navbar.vue'
import Pagination from '../components/Pagination.vue'
import ShowThumbnail from '../components/ShowThumbnail.vue'
import VTitle from '../components/VTitle.vue'
import useAxios from '../composables/useAxios'
import LoginToContinue from './LoginToContinue.vue'
import Loader from './Loader.vue'
import type { ShowMode, Show } from '../types'
import VDropDown from './VDropDown.vue'
import useTitle from '../composables/useTitle'

const shows = ref<Show[]>(),
  page = ref<number>(1),
  totalPages = ref<number>(1),
  router = useRouter(),
  route: RouteLocationNormalized = useRoute(),
  litc = ref<boolean>(false),
  isLoading = ref<boolean>(false)

const props = defineProps<{
  name: string
  resource: string
  showModes: ShowMode[]
}>()

const currmode = computed(() => {
  let showMode = props?.showModes.find((show) => show.mode === route.query.mode)

  return showMode ? showMode : props?.showModes[0]
})

watch(route, () => getShows())

onMounted(async () => {
  useTitle(`${props.name} on Webflix`)
  page.value = !isNaN(route.query.p as any) ? parseInt(route.query.p as any) : 1
  getShows()
})

const getShows = async () => {
  isLoading.value = true
  shows.value = []

  let { data } = await useAxios({
    url: `${props.resource}/${currmode.value.mode}${
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
    name: props.name,
    query: {
      mode: currmode.value.mode,
      p: page.value !== 1 ? page.value : undefined
    }
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
    class="mx-auto flex w-full max-w-break items-center justify-between gap-8 px-5 pt-24"
  >
    <VTitle :title="name" />
    <VDropDown
      class="w-[150px] xs:w-[180px]"
      :options="showModes"
      :selected="currmode"
      textKey="title"
      valueKey="mode"
      @selectionChange="changeMode"
    />
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
