<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import useIntersectionObserver from '../composables/useIntersectionObserver'
import useAxios from '../composables/useAxios'
import type { Show } from '../types'
import ShowThumbnail from './ShowThumbnail.vue'

const container = ref<HTMLElement | undefined>()
const recommendations = ref<Show[]>()
const props = defineProps<{ type: string }>()
const route = useRoute()

onMounted(async () => getRecommended())
watch(route, async () => {
  if (route.params.id) {
    getRecommended()
    if (container.value?.children[0]?.children[1])
      container.value?.children[0]?.children[1].scrollTo(0, 0)
  }
})

const getRecommended = () => {
  useIntersectionObserver(
    container.value,
    async () => {
      let { data } = await useAxios({
        url: `${props.type}/${route.params.id}/recommendations`
      })
      recommendations.value = data.results
    },
    { once: true }
  )
}
</script>

<template>
  <div ref="container">
    <div
      class="relative mx-auto w-full max-w-break bg-wf-300 px-5 py-10"
      v-if="recommendations && recommendations?.length > 0"
    >
      <h2 class="text-3xl font-semibold">Recommendations</h2>
      <div class="scroller mt-4 flex gap-x-3 overflow-x-auto p-1 pb-2">
        <transition-group name="fade" appear>
          <ShowThumbnail
            v-for="recommendation in recommendations.slice(0, 10)"
            :key="recommendation.id"
            :show="recommendation"
            :isFullWidth="false"
          />
        </transition-group>
      </div>
    </div>
  </div>
</template>
