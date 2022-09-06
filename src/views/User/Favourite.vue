<script setup>
import { onMounted, ref } from 'vue'
import VTitle from '../../components/VTitle.vue'
import { useStore } from '../../store'
import { supabase } from '../../supabase'
import ShowThumbnail from '../../components/ShowThumbnail.vue'
import useAxios from '../../composables/useAxios'
import { useRoute, useRouter } from 'vue-router'
import Pagination from '../../components/Pagination.vue'

const store = useStore()
const router = useRouter()
const route = useRoute()
const shows = ref([])
const page = ref(1)
const totalPages = ref(1)
const isFetching = ref(false)
const perPage = 12

onMounted(async () => {
  page.value = route.query.p || 1

  totalPages.value = Math.ceil(
    (
      await supabase
        .from('favourite_shows')
        .select('show', { count: 'exact', head: true })
    ).count / perPage
  )

  getFavShows()
})

const getFavShows = async () => {
  isFetching.value = true
  shows.value = []

  let { data } = await supabase
    .from('favourite_shows')
    .select()
    .eq('user', store.user.id)
    .range((page.value - 1) * perPage, page.value * perPage - 1)
    .order('created_at', { ascending: false })

  data.forEach(async (show) => {
    let { data: showData } = await useAxios({
      url: `${show.type}/${show.show}`
    })

    showData.media_type = show.type
    shows.value.push(showData)
  })
  isFetching.value = false
}

const handlePageChange = (p) => {
  if (p === '+') return page.value++
  if (p === '-') return page.value--
  page.value = p
  window.scrollTo({ top: 0, behavior: 'smooth' })
  router.push({
    path: '/me/fav',
    query: { p: p !== 1 ? p : undefined }
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
      <div v-for="show in shows" :key="show.id" class="transition-all">
        <ShowThumbnail :show="show" @needToLogin="litc = true" />
      </div>
    </transition-group>
  </div>
  <span class="m-6" v-if="isFetching">Loading...</span>

  <Pagination
    v-show="shows.length > 0"
    :currPage="page"
    :totalPages="totalPages"
    @pageChange="handlePageChange"
  />
</template>
