<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { Season } from '../types'
import VImage from './VImage.vue'
import EpisodeCount from './EpisodeCount.vue'

let overlay = ref(),
  btmbx = ref(),
  overlayHidden = ref(false)

defineProps<{
  season: Season
  showId: number
}>()

onMounted(async () => {
  if ('userAgentData' in navigator === false) return

  if (!navigator.userAgentData?.mobile) {
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
</script>

<template>
  <div class="relative">
    <router-link
      class="relative block aspect-[2/3] w-[200px] sm:w-[260px]"
      :to="`/series/${showId}/season/${season.season_number}`"
    >
      <div class="relative cursor-pointer overflow-hidden rounded-sm bg-wf-200">
        <VImage
          v-if="season.poster_path"
          class="relative z-0 aspect-[2/3]"
          :src="`https://image.tmdb.org/t/p/w500/${season.poster_path}`"
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
            {{ season.name }}
          </h2>
          <div
            class="grid grid-cols-3 rounded-md bg-wf-100 p-1.5 text-xs uppercase"
          >
            <EpisodeCount :count="season.episode_count" />
          </div>
        </div>
      </div>
    </router-link>
  </div>
</template>

<style scoped>
.overlay {
  background-image: linear-gradient(to bottom, transparent, #032c37fc);
}
</style>
