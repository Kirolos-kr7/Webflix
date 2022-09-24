<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import useIntersectionObserver from '../composables/IntersectionObserver'
import useAxios from '../composables/useAxios'
import ShowThumbnail from './ShowThumbnail.vue'

const recs = ref()
const recommendations = ref()
const props = defineProps(['type'])
const route = useRoute()

onMounted(async () => getRecommended())
watch(route, async () => {
  if (route.params.id) {
    getRecommended()
  }
})

const getRecommended = () => {
  useIntersectionObserver(
    recs.value,
    async () => {
      let { data } = await useAxios({
        url: `${props.type}/${route.params.id}/recommendations`
      })
      recommendations.value = data
    },
    { once: true }
  )
}
</script>

<template>
  <div
    class="relative mx-auto w-full max-w-break bg-wf-300 px-5 py-10"
    ref="recs"
  >
    <h2 class="text-3xl font-semibold">Recommendations</h2>
    <div class="scroller mt-4 flex gap-x-3 overflow-x-auto pb-2">
      <transition-group name="fade" appear>
        <ShowThumbnail
          v-for="recommendation in recommendations?.results.slice(0, 8)"
          :key="recommendation.id"
          :show="recommendation"
        />
      </transition-group>
    </div>
  </div>
</template>
