<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import useAxios from '../composables/useAxios'
import Loader from './Loader.vue'
import Recommendations from './Recommendations.vue'
import VImage from './VImage.vue'
import Seasons from './Seasons.vue'
import type { ShowDetails, CastMember, Trailer } from '../types'
import Collection from './Collection.vue'
import useHead from '../composables/useHead'
import Rate from './Rate.vue'
import Facts from './Facts.vue'
import Cast from './Cast.vue'

const route = useRoute(),
  router = useRouter(),
  show = ref<ShowDetails | null>(),
  cast = ref<CastMember[] | null>(),
  trailer = ref<Trailer | null>(),
  complementary = ref<HTMLElement | null>(),
  isLoading = ref(false),
  nowAt = ref(''),
  playingTrailer = ref(false),
  props = defineProps<{ type: string }>()

onMounted(() => {
  fetchData()

  requestAnimationFrame(handleImageOnScroll)
  window.addEventListener('resize', handleComplenetarysize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleComplenetarysize)
})

const getTrailer = async () => {
  playingTrailer.value = true
  let { data: videos } = await useAxios({
    url: `${props.type}/${route.params.id}/videos`
  })

  let hasTrailer = await videos.results.find(
    (vid: Trailer) => vid.type === 'Trailer'
  )

  trailer.value = hasTrailer ? hasTrailer : await videos.results[0]
}

watch(route, () => {
  let currPath = route.matched[0].path
  if (
    route.params.id !== nowAt.value &&
    (currPath === '/movie/:id' || currPath === '/series/:id')
  ) {
    fetchData()
  }
})

const fetchData = async () => {
  show.value = null
  cast.value = null
  trailer.value = null
  nowAt.value = route.params.id as string
  isLoading.value = true

  let { data, error }: { data: ShowDetails; error: any } = await useAxios({
    url: `${props.type}/${route.params.id}`
  })
  if (error && !error.response.data.success) return router.replace('/404')

  show.value = data
  console.log(data)

  useHead({
    title: `${data.name || data.title} on Webflix`,
    description: `${data.overview}`,
    image: `https://image.tmdb.org/t/p/w300${data.poster_path}`
  })
  isLoading.value = false

  let { data: showCast } = await useAxios({
    url: `${props.type}/${route.params.id}/credits`
  })
  cast.value = showCast.cast
}

const getReleaseDate = (d: Date) => {
  return new Date(d).getFullYear()
}

const getLanguage = (lang: string) => {
  return lang.toUpperCase()
}

const getNumebrOf = (n: number, type: string) => {
  if (n === 1) return n + ' ' + type
  else return n + ' ' + type + 's'
}

const getDuration = (n: number | null) => {
  if (!n) return 0

  if (n > 360) return '4hrs ' + (n - 360) + 'min'
  if (n === 360) return '4hrs '

  if (n > 240) return '3hrs ' + (n - 240) + 'min'
  if (n === 240) return '3hrs '

  if (n > 120) return '2hrs ' + (n - 120) + 'min'
  if (n === 120) return '2hrs '

  if (n > 60) return '1hr ' + (n - 60) + 'min'
  if (n === 60) return '1hr '

  if (n < 60) return n + 'mins'
}

const handleComplenetarysize = () => {
  if (!complementary.value?.parentElement) return

  complementary.value.style.height =
    (complementary.value.parentElement.offsetHeight - window.innerHeight || 0) +
    'px'
}

const handleImageOnScroll = () => {
  requestAnimationFrame(handleImageOnScroll)
  if (window.scrollY > window.innerHeight) return
  const offset = (1 + window.scrollY / 5000).toString()
  const bd: HTMLElement | null = document.querySelector('[data-backdrop]')
  if (bd) {
    bd.style.scale = offset
    bd.style.top = -window.scrollY / 3 + 'px'
  }
}

watch(complementary, () => {
  if (complementary.value) handleComplenetarysize()
})
</script>

<template>
  <div class="relative min-h-screen overflow-hidden" v-if="!isLoading && show">
    <VImage
      v-if="show.backdrop_path"
      data-backdrop=""
      class="fixed top-0 z-[0] max-h-screen min-h-[65vh] translate-x-0 overflow-hidden object-cover transition-all xs:min-h-[75vh] md:!min-h-screen md:translate-x-40 lg:translate-x-60 xl:translate-x-72 2xl:translate-x-80"
      :src="`https://image.tmdb.org/t/p/original${show.backdrop_path}`"
    />
    <div
      ref="overlay"
      class="overlay pointer-events-none absolute left-0 top-0 z-10 h-full max-h-screen w-full p-3 transition-opacity"
    />
    <div class="absolute bottom-0 w-full bg-[#032c37]" ref="complementary" />

    <div class="relative mx-auto mt-[50vh] max-w-break">
      <div
        class="relative bottom-8 z-10 mx-8 mt-[50vh] flex min-h-[50vh] flex-col justify-end md:absolute md:bottom-auto md:top-1/2 md:mx-16 md:mt-auto md:max-w-[48%] md:-translate-y-1/2 md:justify-center lg:mx-32 lg:max-w-[38%]"
      >
        <em
          ><h3 class="text-gray-400">
            {{ show.tagline }}
          </h3></em
        >
        <h2
          class="mt-3 break-words text-5xl font-semibold"
          style="hyphens: auto"
          :class="
            show.name?.length > 40 || show.title?.length > 40
              ? '!text-4xl '
              : ''
          "
        >
          {{ show.name || show.title }}
        </h2>

        <ul
          class="mt-4 flex flex-wrap items-center [&>*]:mr-2 [&>*]:flex [&>*]:gap-2 [&>*]:before:my-auto [&>*]:before:block [&>*]:before:h-1 [&>*]:before:w-1 [&>*]:before:rounded-full [&>*]:before:bg-white [&>li:first-of-type]:before:hidden"
        >
          <template v-if="type === 'movie'">
            <li>
              {{ getReleaseDate(show.release_date) }}
            </li>
            <li>
              {{ getDuration(show.runtime) }}
            </li>
            <li>
              {{ getLanguage(show.original_language) }}
            </li>
          </template>
          <template v-else>
            <li>
              {{ getReleaseDate(show.first_air_date) }}
            </li>
            <li>
              {{ getNumebrOf(show.number_of_seasons, 'Season') }}
            </li>
            <li>
              {{ getNumebrOf(show.number_of_episodes, 'Episode') }}
            </li>
            <li>
              {{ getLanguage(show.original_language) }}
            </li>
          </template>

          <Rate :rate="show.vote_average.toFixed(1)" />
        </ul>

        <p class="mt-2 text-gray-300">
          {{ show.overview }}
        </p>
        <button
          @click="getTrailer()"
          class="relative mt-6 flex w-max items-center gap-x-2 rounded-sm bg-wf-100 px-3 py-1 text-sm font-extralight outline-none ring-offset-2 ring-offset-slate-400 transition-colors hover:bg-wf-100/75 focus-visible:ring"
        >
          <svg
            class="h-5 w-5 cursor-pointer text-gray-400"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
              clip-rule="evenodd"
            ></path>
          </svg>
          <span>Play Trailer</span>
        </button>
      </div>
    </div>
  </div>

  <div class="relative bg-wf-300" v-if="!isLoading">
    <div
      class="mx-auto grid w-full max-w-break gap-x-5 px-5 py-10 md:grid-cols-4"
    >
      <Cast :cast="cast" v-if="cast && cast.length > 0" />

      <Facts :show="show" :type="type" class="order-1 mb-8 md:order-2" />
    </div>

    <Seasons
      v-if="show?.seasons && show.seasons.length > 0"
      :seasons="show?.seasons"
      :showId="show?.id"
    />

    <Collection
      v-if="show?.belongs_to_collection"
      :collectionId="show?.belongs_to_collection.id"
    />

    <Recommendations :type="type" />
  </div>

  <Loader v-if="isLoading" />

  <transition name="fade">
    <div
      v-if="playingTrailer"
      @click="playingTrailer = false"
      class="fixed inset-0 z-30 h-screen w-full bg-wf-300/80 backdrop-blur-lg"
    >
      <div v-if="trailer?.site === 'YouTube'">
        <div
          class="absolute inset-1/2 w-9/12 -translate-x-1/2 -translate-y-1/2 pb-[56.25%] xl:h-[600px] xl:pb-0"
        >
          <iframe
            class="absolute left-0 top-1/2 aspect-video h-full w-full -translate-y-1/2"
            :src="`https://www.youtube.com/embed/${trailer?.key}`"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    </div>
  </transition>
</template>

<style>
.overlay {
  background: linear-gradient(to left, transparent, rgb(3 44 55) 75%);
}

@media screen and (max-width: 768px) {
  .overlay {
    background: linear-gradient(to bottom, transparent, rgb(3 44 55) 75%);
  }
}

@media screen and (max-width: 450px) {
  .overlay {
    background: linear-gradient(to bottom, transparent, rgb(3 44 55) 60%);
  }
}
</style>
