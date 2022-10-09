<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import useIntersectionObserver from '../composables/useIntersectionObserver'
import useAxios from '../composables/useAxios'
import type { Collection, Show } from '../types'
import ShowThumbnail from './ShowThumbnail.vue'

const container = ref<HTMLElement | undefined>()
const collection = ref<Collection>()
const props = defineProps<{ collectionId: number }>()
const route = useRoute()

onMounted(async () => getRecommended())
watch(route, async () => {
  if (route.params.id) {
    getRecommended()
    if (container.value?.children[1])
      container.value?.children[1].scrollTo(0, 0)
  }
})

const getRecommended = () => {
  useIntersectionObserver(
    container.value,
    async () => {
      let { data } = await useAxios({
        url: `collection/${props.collectionId}`
      })
      data.parts.forEach((part: Show) => {
        part.media_type = 'movie'
      })
      collection.value = data
    },
    { once: true }
  )
}
</script>

<template>
  <div
    class="relative mx-auto w-full max-w-break bg-wf-300 px-5 py-10"
    ref="container"
  >
    <h2 class="text-3xl font-semibold" v-if="collection">
      {{ collection.name }}
    </h2>
    <div
      class="scroller mt-4 flex gap-x-3 overflow-x-auto pb-2"
      v-if="collection"
    >
      <transition-group name="fade" appear>
        <ShowThumbnail
          v-for="recommendation in collection.parts"
          :key="recommendation.id"
          :show="recommendation"
          :isFullWidth="false"
        />
      </transition-group>
    </div>
  </div>
</template>
