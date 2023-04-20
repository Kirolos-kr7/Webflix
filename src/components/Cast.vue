<script setup lang="ts">
import { ref } from 'vue'
import VImage from './VImage.vue'

const props = defineProps<{ cast: any }>()
const castToShow = ref<number>(12)

const showMoreCast = () => {
  if (!props.cast) return

  const diff = props.cast.length - castToShow.value
  if (Math.sign(diff) != 1) return
  if (diff > 12) castToShow.value += 12
  else castToShow.value += diff
}
</script>

<template>
  <div class="order-2 col-span-3 md:order-1">
    <h2 class="text-3xl font-semibold">Cast</h2>
    <div class="!relative">
      <div
        class="mt-4 flex max-w-[calc(100vw-2.5rem)] gap-x-3 overflow-x-auto p-1 pb-2"
      >
        <div
          v-for="member in cast.slice(0, castToShow)"
          :key="member.credit_id"
          class="min-w-[9rem] max-w-[9rem] rounded-md bg-wf-200"
        >
          <router-link :to="`/person/${member.id}`" tabindex="-1">
            <VImage
              v-if="member.profile_path"
              class="h-52 w-36 rounded-t-md object-cover transition-opacity hover:opacity-75"
              :src="`https://image.tmdb.org/t/p/w200${member.profile_path}`"
              :alt="member.name"
            />
            <VImage
              v-else
              class="h-52 w-36 rounded-t-md object-cover"
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
              class="-mx-1 inline-block rounded-sm px-1 font-semibold outline-none hover:text-gray-400 focus-visible:ring-2"
              >{{ member.name }}</router-link
            >
            <span class="block text-green-400">AS</span>
            <h4 class="text-gray-400">{{ member.character }}</h4>
          </div>
        </div>
        <button
          v-if="cast.length > castToShow"
          @click="showMoreCast()"
          class="relative rounded-md bg-wf-200 px-10 outline-none transition-colors hover:bg-wf-200/60 focus-visible:ring"
        >
          <span
            class="absolute -translate-x-1/2 -translate-y-1/2 rotate-90 text-5xl font-black text-wf-300"
            >More</span
          >
        </button>
      </div>
    </div>
  </div>
</template>
