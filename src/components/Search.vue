<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import useAxios from '../composables/useAxios'
import type { Show } from '../types'
import VImage from './VImage.vue'

const props = defineProps<{ searchDialog: boolean }>(),
  emits = defineEmits(['hideSearchDialog']),
  router = useRouter(),
  inputSearch = ref<string>(''),
  autoFocusInput = ref<HTMLInputElement>(),
  resContainer = ref<HTMLElement>(),
  currIndex = ref<number>(0),
  searchResult = ref<Show[]>([])

watch(props, () => {
  if (props.searchDialog) {
    setTimeout(() => {
      autoFocusInput.value?.focus()
    }, 100)
  }
})

const searchNow = async (e: Event) => {
  inputSearch.value = (e.target as HTMLInputElement).value

  currIndex.value = 0
  if (inputSearch.value === '') {
    searchResult.value = []
    return
  }
  let { data } = await useAxios({
    url: `search/multi?query=${inputSearch.value}`
  })

  searchResult.value = data?.results.splice(0, 5)
}

const handleArrows = (e: KeyboardEvent) => {
  if (!resContainer.value) return
  let itemsLength = resContainer.value?.children.length - 1

  if (itemsLength <= 0 || !searchResult.value) return

  if (currIndex.value >= 0)
    resContainer.value.children[currIndex.value].classList.remove('!bg-wf-200')

  if (e.key === 'ArrowUp')
    if (currIndex.value == 0) currIndex.value = itemsLength
    else if (currIndex.value > 0) currIndex.value--

  if (e.key === 'ArrowDown')
    if (currIndex.value == itemsLength) currIndex.value = 0
    else if (currIndex.value < itemsLength) currIndex.value++

  resContainer.value.children[currIndex.value].classList.add('!bg-wf-200')
}

const toShow = () => {
  if (searchResult.value.length == 0 || !resContainer.value) return
  if (resContainer.value?.children.length > searchResult.value.length)
    router.push('/404')

  if (navigator.userAgentData?.mobile)
    router.push({ name: 'Search', query: { query: inputSearch.value } })
  else {
    let result: Show = searchResult.value[currIndex.value]

    if (result)
      result.media_type === 'person'
        ? router.push(`/person/${result.id}`)
        : result.media_type === 'movie'
        ? router.push(`/movie/${result.id}`)
        : result.media_type === 'tv'
        ? router.push(`/series/${result.id}`)
        : router.push('/404')
    else router.push({ name: 'Search', query: { query: inputSearch.value } })
  }

  exit()
}

const exit = () => {
  inputSearch.value = ''
  searchResult.value = []
  emits('hideSearchDialog')
}
</script>

<template>
  <transition name="fadeIn">
    <div
      class="fixed inset-0 z-40 min-h-screen w-full bg-transparent backdrop-blur-sm"
      v-if="searchDialog"
    >
      <div
        class="absolute inset-0 h-full w-full bg-black/60 transition-all"
        @click="exit"
      ></div>
      <div
        class="relative z-[41] mx-auto mt-32 flex w-11/12 flex-col items-center sm:w-[400px] md:w-[500px] lg:w-[600px]"
      >
        <h2 class="mb-2 w-full text-left text-4xl font-semibold">Search</h2>
        <div class="flex w-full items-center">
          <input
            :value="inputSearch"
            @keyup.enter="toShow"
            @keyup="handleArrows"
            @input="searchNow($event)"
            ref="autoFocusInput"
            type="text"
            class="w-full rounded-sm border-0 px-3 py-2.5 text-base font-light text-black outline-none"
            style="background-image: linear-gradient(#00000020, transparent)"
            placeholder="search a movie, series or a person..."
          />
        </div>
        <div v-if="searchResult" class="w-full" ref="resContainer">
          <router-link
            v-for="result in searchResult"
            :key="result.id"
            class="flex w-full items-center overflow-hidden bg-wf-200/80 hover:bg-wf-300/80"
            :to="
              result.media_type === 'person'
                ? `/person/${result.id}`
                : result.media_type === 'movie'
                ? `/movie/${result.id}`
                : result.media_type === 'tv'
                ? `/series/${result.id}`
                : '/404'
            "
            @click="exit"
          >
            <VImage
              v-if="result.media_type === 'person' && result.profile_path"
              :src="`https://image.tmdb.org/t/p/w200/${result.profile_path}`"
              class="h-16 w-[43px] object-cover"
            />
            <VImage
              v-else-if="result.poster_path"
              :src="`https://image.tmdb.org/t/p/w200/${result.poster_path}`"
              class="h-16 w-[43px] object-cover"
            />
            <VImage v-else src="/broken.png" class="h-16 object-cover" />

            <span class="truncate p-3"> {{ result.name || result.title }}</span>
          </router-link>
          <router-link
            :to="{ name: 'Search', query: { query: inputSearch } }"
            v-if="searchResult?.length > 0"
            class="block w-full rounded-b-md bg-wf-300 p-3 hover:bg-wf-100"
          >
            Watch More
          </router-link>
        </div>
      </div>
      <button
        @click="exit"
        class="absolute right-5 top-5 rounded-sm bg-red-600 p-3 hover:bg-red-500"
      >
        <svg
          class="h-5 w-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd"
          ></path>
        </svg>
      </button>
    </div>
  </transition>
</template>
