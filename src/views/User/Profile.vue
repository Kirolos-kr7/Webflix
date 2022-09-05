<script setup>
import { onMounted, ref } from 'vue'
import VImage from '../../components/VImage.vue'
import { useStore } from '../../store'
import { supabase } from '../../supabase'
const store = useStore()

const favShowsCount = ref('..')

onMounted(async () => {
  let { data } = await supabase
    .from('favourite_shows')
    .select()
    .eq('user', store.user.id)

  favShowsCount.value = data.length
})
</script>

<template>
  <div class="grid grid-cols-3 gap-5">
    <div class="col-span-2 flex items-center gap-3 rounded-md bg-wf-200 p-5">
      <VImage
        class="h-20 w-20 rounded-full"
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ79GjtRSlnYnEiHzWrOj29US2HRtXI_olH1A&usqp=CAU"
      />
      <div>
        <h1 class="text-3xl font-semibold">
          {{ store.user.user_metadata.name }}
        </h1>
        <h2 class="text-lg">{{ store.user.email }}</h2>
      </div>
    </div>
    <router-link
      to="/me/fav"
      class="relative overflow-hidden rounded-md bg-wf-200/50 p-5 text-2xl font-semibold hover:bg-wf-200/80"
    >
      Favourite Shows [{{ favShowsCount }}]
      <svg
        class="absolute right-3 -bottom-8 -m-0.5 h-20 w-20 text-red-500 transition-all"
        fill="currentColor"
        stroke="#000000"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        ></path>
      </svg>
    </router-link>
  </div>
</template>
