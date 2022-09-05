<script setup>
import { onMounted, ref } from 'vue'
import VTitle from '../../components/VTitle.vue'
import { useStore } from '../../store'
import { supabase } from '../../supabase'
import ShowThumbnail from '../../components/ShowThumbnail.vue'
import useAxios from '../../composables/useAxios'

const store = useStore()
const shows = ref([])
const isFetching = ref(false)

onMounted(async () => {
  isFetching.value = true
  let { data } = await supabase
    .from('favourite_shows')
    .select()
    .eq('user', store.user.id)

  data.forEach(async (show) => {
    let { data: showData } = await useAxios({
      url: `${show.type}/${show.show}`
    })

    shows.value.push(showData)
  })
  isFetching.value = false
})
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
    <span class="m-6" v-if="isFetching">Loading...</span>
  </div>
</template>
