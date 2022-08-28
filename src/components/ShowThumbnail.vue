<script setup>
import { onMounted, ref } from 'vue'
import { useStore } from '../store'
import VImage from './VImage.vue'
import VSvg from './VSvg.vue'

let overlay = ref(),
  store = useStore(),
  btmbx = ref(),
  overlayHidden = ref(false)

onMounted(() => {
  if (!navigator.userAgentData.mobile) {
    overlay.value.addEventListener('mouseover', () => {
      overlayHidden.value = true
    })

    overlay.value.addEventListener('mouseleave', () => {
      overlayHidden.value = false
    })
  } else {
    overlay.value.addEventListener(
      'touchstart',
      () => {
        overlayHidden.value = true
      },
      { passive: true }
    )
    overlay.value.addEventListener(
      'touchend',
      () => {
        overlayHidden.value = false
      },
      { passive: true }
    )
    overlay.value.addEventListener(
      'touchcancel',
      () => {
        overlayHidden.value = false
      },
      { passive: true }
    )
  }
})

const props = defineProps({
  show: {
    type: Object,
    required: true
  }
})
let i = 0
const addToFav = () => {
  store.createToast({
    msg: 'Added to favourites ' + ++i
  })
  // console.log(props.show)
}
</script>

<template>
  <div class="relative">
    <router-link
      class="relative block aspect-[2/3] min-h-[300px] min-w-[200px]"
      :to="`/${
        show.media_type === 'person'
          ? `person/${show.id}`
          : show.media_type === 'movie'
          ? `movie/${show.id}`
          : show.media_type === 'tv'
          ? `series/${show.id}`
          : '404'
      }`"
    >
      <div
        class="daContainer relative cursor-pointer overflow-hidden rounded-sm bg-wf-200"
      >
        <VImage
          v-if="show.poster_path"
          class="relative z-0"
          :src="`https://image.tmdb.org/t/p/w500/${show.poster_path}`"
        />
        <VImage
          v-else-if="show.profile_path"
          class="relative z-0"
          :src="`https://image.tmdb.org/t/p/w500/${show.profile_path}`"
        />
        <VImage v-else src="/broken.png" class="relative z-0" />

        <div
          :class="overlayHidden ? 'opacity-0' : ''"
          ref="overlay"
          class="overlay absolute bottom-0 left-0 z-10 h-full w-full p-3 transition-opacity"
          style=""
        ></div>
        <div
          ref="btmbx"
          class="absolute bottom-0 left-0 z-10 flex w-full items-end justify-between gap-x-2 p-3 text-lg font-medium transition-opacity"
          :class="overlayHidden ? 'opacity-0' : ''"
        >
          <h2 class="leading-6">
            {{ show.name || show.title }}
          </h2>
          <span
            class="flex items-center text-yellow-300"
            v-if="show.media_type !== 'person'"
          >
            <svg
              class="h-6 w-6"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              ></path>
            </svg>
            {{ show.vote_average.toFixed(1) }}</span
          >
        </div>
      </div>
    </router-link>
    <div class="absolute right-0 top-0 z-[11] p-2">
      <button
        @click="addToFav()"
        class="rounded-md bg-wf-200/40 p-1 shadow-2xl hover:bg-wf-200/80"
      >
        <VSvg
          class="text-red-100"
          d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
        />
      </button>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  background-image: linear-gradient(to bottom, transparent, #032c37fc);
}
</style>
