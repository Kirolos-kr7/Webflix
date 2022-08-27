<script setup>
import { ref } from 'vue'
import VImage from '../../components/VImage.vue'
import { useStore } from '../../store'
const store = useStore()

let links = ref([
  { txt: 'Favourite', to: '/me/fav' },
  { txt: 'Watchlist', to: '/me/watchlist' }
])
</script>

<template>
  <div class="rounded-md bg-wf-200 p-5">
    <div class="mb-3 flex items-center gap-3">
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
    <div class="flex gap-3">
      <router-link v-for="{ txt, to } in links" :key="to" :to="to">{{
        txt
      }}</router-link>
    </div>
  </div>
</template>
