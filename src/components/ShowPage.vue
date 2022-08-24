<script setup>
import gsap from 'gsap'
import scrollTrigger from 'gsap/ScrollTrigger'
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Navbar from '../components/Navbar.vue'
import useAxios from '../composables/useAxios'
import Loader from './Loader.vue'
import Recomendations from './Recomendations.vue'
import VImage from './VImage.vue'

gsap.registerPlugin(scrollTrigger)

const route = useRoute(),
  router = useRouter(),
  show = ref(null),
  cast = ref(null),
  totalCast = ref(null),
  isLoading = ref(false),
  nowAt = ref(null),
  playingTrailer = ref(false),
  trailer = ref(null),
  props = defineProps(['type']),
  castToShow = ref(0)

onMounted(() => {
  fetchData()
})

const enter = (el) => {
  gsap.to(el, {
    top: 650,
    scrollTrigger: {
      trigger: 'body',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  })
}

watch(route, () => {
  let currPath = route.matched[0].path
  console.log()
  if (
    route.params.id !== nowAt.value &&
    (currPath === '/movie/:id' || currPath === '/series/:id')
  ) {
    fetchData()
  }
})

const fetchData = async () => {
  show.value = null
  cast.value = []
  totalCast.value = []
  trailer.value = null
  nowAt.value = route.params.id
  isLoading.value = true

  let { data, error } = await useAxios({
    url: `${props.type}/${route.params.id}`
  })
  if (error && !error.response.data.success) return router.replace('/404')

  show.value = data
  document.title = `${data?.name || data?.title} - Webflix`
  isLoading.value = false

  let { data: showCast } = await useAxios({
    url: `${props.type}/${route.params.id}/credits`
  })
  totalCast.value = showCast.cast
  incremeantCast()
  cast.value = showCast.cast.slice(0, 12)

  let { data: showTrailer } = await useAxios({
    url: `${props.type}/${route.params.id}/videos`
  })
  trailer.value = await showTrailer.results[0]
}

const getMoreCast = () => {
  if (cast.value.length < totalCast.value.length) {
    incremeantCast()
    cast.value = totalCast.value?.slice(0, castToShow.value)
  }
}

const incremeantCast = () => {
  if (totalCast.value.length - cast.value.length < 12)
    castToShow.value += totalCast.value.length - cast.value.length
  else castToShow.value += 12
}

const getReleaseDate = (str) => {
  return str?.slice(0, 4)
}

const getLanguage = (str) => {
  return str?.toUpperCase()
}

const getNumebrOf = (n, type) => {
  if (n === 1) return n + ' ' + type
  else return n + ' ' + type + 's'
}

const getDuration = (n) => {
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
</script>

<template>
  <div class="flex flex-col">
    <Navbar />

    <Loader v-if="isLoading" />

    <div v-else>
      <div
        class="relative min-h-screen overflow-hidden bg-[#032c37]"
        v-if="show !== null"
      >
        <transition appear @enter="enter">
          <VImage
            v-if="show.backdrop_path"
            class="gsap-bg absolute top-0 z-0 max-h-screen min-h-[65vh] translate-x-0 overflow-hidden object-cover xs:min-h-[75vh] md:!min-h-screen md:translate-x-40 lg:translate-x-60 xl:translate-x-72 2xl:translate-x-80"
            :src="`https://image.tmdb.org/t/p/original/${show.backdrop_path}`"
          />
        </transition>
        <div
          ref="overlay"
          class="overlay pointer-events-none absolute top-0 left-0 z-10 h-full max-h-screen w-full p-3 transition-opacity"
        ></div>

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
            <p class="mt-4 flex flex-wrap items-center" v-if="type === 'movie'">
              <span>
                {{ getReleaseDate(show?.release_date) }}
              </span>
              <span class="mx-1.5 inline-block h-1 w-1 rounded-full bg-white">
              </span>
              <span>
                {{ getDuration(show?.runtime) }}
              </span>
              <span
                class="mx-1.5 inline-block h-1 w-1 rounded-full bg-white"
              ></span>
              <span>
                {{ getLanguage(show?.original_language) }}
              </span>
            </p>
            <p class="mt-4 flex flex-wrap items-center" v-else>
              <span>
                {{ getReleaseDate(show?.first_air_date) }}
              </span>
              <span class="mx-1.5 inline-block h-1 w-1 rounded-full bg-white">
              </span>
              <span>
                {{ getNumebrOf(show?.number_of_seasons, 'Season') }}
              </span>
              <span
                class="mx-1.5 inline-block h-1 w-1 rounded-full bg-white"
              ></span>
              <span>
                {{ getNumebrOf(show?.number_of_episodes, 'Episode') }}
              </span>
              <span
                class="mx-1.5 inline-block h-1 w-1 rounded-full bg-white"
              ></span>
              <span>
                {{ getLanguage(show?.original_language) }}
              </span>
            </p>
            <p class="mt-2 text-gray-300">
              {{ show?.overview }}
            </p>
            <button
              @click="playingTrailer = true"
              class="relative mt-6 flex w-max items-center gap-x-2 rounded-sm bg-darkblue-100 px-3 py-1 text-sm font-extralight transition-colors hover:bg-darkblue-100/75"
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
    </div>

    <div
      class="mx-auto grid w-full max-w-break gap-x-5 px-5 py-10 md:grid-cols-4"
    >
      <div class="order-2 col-span-3 md:order-1" v-if="cast?.length > 0">
        <h2 class="text-3xl font-semibold">Cast</h2>
        <div class="!relative">
          <div
            class="mt-4 flex max-w-[calc(100vw-2.5rem)] gap-x-3 overflow-x-auto pb-2"
          >
            <div
              v-for="member in cast"
              :key="member.cast_id"
              class="min-w-[9rem] max-w-[9rem] overflow-hidden rounded-md bg-darkblue-200"
            >
              <router-link :to="`/person/${member.id}`">
                <VImage
                  v-if="member.profile_path"
                  class="h-52 w-36 object-cover transition-opacity hover:opacity-75"
                  :src="`https://image.tmdb.org/t/p/w200/${member.profile_path}`"
                  :alt="member.name"
                />
                <VImage
                  v-else
                  class="h-52 w-36 object-cover"
                  :src="
                    member.gender === 1
                      ? '/female-placeholder.jpeg'
                      : '/male-placeholder.jpg'
                  "
                  :alt="member.name"
                />
              </router-link>
              <div class="p-2">
                <router-link
                  :to="`/person/${member.id}`"
                  class="block font-semibold hover:text-gray-400"
                  >{{ member.name }}</router-link
                >
                <span class="text-green-400">AS</span>
                <h4 class="text-gray-400">{{ member.character }}</h4>
              </div>
            </div>
            <button
              v-if="cast?.length < totalCast?.length"
              @click="getMoreCast()"
              class="relative rounded-md bg-darkblue-200 px-10 transition-colors hover:bg-darkblue-200/60"
            >
              <span
                class="absolute -translate-x-1/2 -translate-y-1/2 rotate-90 text-5xl font-black text-darkblue-300"
                >More</span
              >
            </button>
          </div>
        </div>
      </div>
      <div class="order-1 mb-8 md:order-2">
        <h2 class="text-3xl font-semibold">Facts</h2>
        <div class="mt-3 grid gap-3">
          <div v-if="show?.status">
            <h3 class="text-lg font-medium">Status</h3>
            <p class="text-sm text-gray-400">{{ show?.status }}</p>
          </div>
          <div v-if="show?.budget">
            <h3 class="text-lg font-medium">Budget</h3>
            <p class="text-sm text-gray-400">
              {{
                new Intl.NumberFormat('us-EN', {
                  style: 'currency',
                  currency: 'USD',
                  maximumFractionDigits: 0
                }).format(show?.budget)
              }}
            </p>
          </div>
          <div v-if="show?.revenue">
            <h3 class="text-lg font-medium">Revenue</h3>
            <p class="text-sm text-gray-400">
              {{
                new Intl.NumberFormat('us-EN', {
                  style: 'currency',
                  currency: 'USD',
                  maximumFractionDigits: 0
                }).format(show?.revenue)
              }}
            </p>
          </div>

          <div v-if="show?.type">
            <h3 class="text-lg font-medium">Type</h3>
            <p class="text-sm text-gray-400">
              {{ show?.type }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <Recomendations :type="type" />
  </div>

  <transition name="fade">
    <div
      v-if="playingTrailer"
      @click="playingTrailer = false"
      class="fixed inset-0 z-30 h-screen w-full bg-darkblue-300/80 backdrop-blur-lg"
    >
      <div v-if="trailer?.site === 'YouTube'">
        <div
          class="absolute inset-1/2 w-9/12 -translate-x-1/2 -translate-y-1/2 pb-[56.25%] xl:h-[600px] xl:pb-0"
        >
          <iframe
            class="absolute top-1/2 left-0 h-full w-full -translate-y-1/2"
            style="aspect-ratio: 16/9"
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
