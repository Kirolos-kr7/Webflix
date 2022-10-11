<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useStore } from '../store'
import { supabase } from '../supabase'
import VImage from './VImage.vue'
import type { Show } from '../types'

let overlay = ref<HTMLElement | null>(),
  store = useStore(),
  isFavourite = ref(false),
  btmbx = ref(),
  overlayHidden = ref(false)

const props = withDefaults(
  defineProps<{ show: Show; isFullWidth?: boolean }>(),
  {
    isFullWidth: true
  }
)

const emits = defineEmits(['needToLogin'])

onMounted(async () => {
  if (store.user) {
    let { data: favourite_shows } = await supabase
      .from('favourite_shows')
      .select()
      .eq('show', props.show.id)
      .eq('user', store.user.id)

    if (favourite_shows && favourite_shows?.length > 0) isFavourite.value = true
  }

  if ('userAgentData' in navigator === false || !overlay.value) return

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

const addToFav = async () => {
  if (!store.user) {
    emits('needToLogin')
    return
  }

  if (!isFavourite.value) {
    isFavourite.value = true
    store.createToast(
      {
        msg: 'Added to favourites',
        redirect: '/me/fav',
        action: 'See List'
      },
      2500
    )
    await supabase.from('favourite_shows').insert([
      {
        user: store.user.id,
        show: props.show.id,
        type: props.show.media_type
      }
    ])
  } else {
    isFavourite.value = false
    store.createToast({
      msg: 'Removed from favourites'
    })
    await supabase
      .from('favourite_shows')
      .delete()
      .match({ user: store.user.id, show: props.show.id })
  }
}
</script>

<template>
  <div class="relative">
    <router-link
      class="relative block aspect-[2/3]"
      :class="isFullWidth ? 'w-full' : 'w-[200px] sm:w-[260px]'"
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
          class="relative z-0 aspect-[2/3]"
          :src="`https://image.tmdb.org/t/p/w500/${show.poster_path}`"
        />
        <VImage
          v-else-if="show.profile_path"
          class="relative z-0 aspect-[2/3]"
          :src="`https://image.tmdb.org/t/p/w500/${show.profile_path}`"
        />
        <VImage v-else src="/broken.png" class="relative z-0 aspect-[2/3]" />

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
        class="rounded-md bg-wf-200/70 p-2 shadow-2xl transition-colors hover:bg-wf-200/90"
      >
        <svg
          class="-m-0.5 h-6 w-6 transition-all"
          id="laCpN2WlIFj2knljfi6zR"
          :class="isFavourite ? 'text-red-500' : 'text-white/80'"
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
      </button>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  background-image: linear-gradient(to bottom, transparent, #032c37fc);
}
</style>
