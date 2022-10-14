<script setup lang="ts">
import { onMounted, ref } from 'vue'
import VTitle from '../../components/VTitle.vue'
import { useStore } from '../../store'
import { supabase } from '../../supabase'
import ShowThumbnail from '../../components/ShowThumbnail.vue'
import useAxios from '../../composables/useAxios'
import { useRoute, useRouter } from 'vue-router'
import Pagination from '../../components/Pagination.vue'
import Loader from '../../components/Loader.vue'
import type { Show } from '../../types'
import useTitle from '../../composables/useTitle'

useTitle('Favourites on Webflix')

const store = useStore()
const router = useRouter()
const route = useRoute()
const shows = ref<Show[]>([])
const page = ref<number>(1)
const totalPages = ref<number>(1)
const isLoading = ref<boolean>(true)
const perPage = 15

onMounted(async () => {
  page.value = (route.query.p as any) || 1

  const favShows = await supabase
    .from('favourite_shows')
    .select('show', { count: 'exact', head: true })

  if (!favShows.count) return
  totalPages.value = Math.ceil(favShows.count / perPage)
  getFavShows()
})

const getFavShows = async () => {
  isLoading.value = true
  shows.value = []

  if (!store.user) return

  let { data } = await supabase
    .from('favourite_shows')
    .select()
    .eq('user', store.user.id)
    .range((page.value - 1) * perPage, page.value * perPage - 1)
    .order('created_at', { ascending: false })

  data?.forEach(async (show) => {
    let { data: showData } = await useAxios({
      url: `${show.type}/${show.show}`
    })

    showData.media_type = show.type
    shows.value.push(showData)
  })
  isLoading.value = false
}

const handlePageChange = (p: string | number) => {
  if (p === '+') page.value++
  else if (p === '-') page.value--
  else if (typeof p === 'number') {
    page.value = p as number
  } else page.value = 1

  window.scrollTo({ top: 0, behavior: 'smooth' })
  router.push({
    path: '/me/fav',
    query: { p: page.value !== 1 ? page.value : undefined }
  })

  getFavShows()
}
</script>

<template>
  <VTitle title="Favourite" />

  <div
    class="mx-auto grid max-w-break grid-cols-1 gap-5 py-5 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
  >
    <transition-group name="fade" appear>
      <ShowThumbnail
        v-for="show in shows"
        :key="show.id"
        :show="show"
        class="transition-all"
      >
      </ShowThumbnail>
    </transition-group>
  </div>

  <Loader v-if="isLoading" />

  <Pagination
    v-if="!isLoading && shows && shows.length > 0"
    :currPage="page"
    :totalPages="totalPages"
    @pageChange="handlePageChange"
  />
</template>
