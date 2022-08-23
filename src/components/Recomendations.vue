<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import useIntersectionObserver from '../composables/IntersectionObserver'
import useAxios from '../composables/useAxios'
import ShowThumbnail from './ShowThumbnail.vue'

const recs = ref()
const recomendations = ref()
const props = defineProps(['type'])
const route = useRoute()

onMounted(async () => {
  useIntersectionObserver(
    recs.value,
    async () => {
      let { data } = await useAxios({
        url: `${props.type}/${route.params.id}/recommendations`
      })
      recomendations.value = data
    },
    { once: true }
  )
})
</script>

<template>
  <div class="mx-auto w-full max-w-break px-5 py-10" ref="recs">
    <h2 class="text-3xl font-semibold">Recomendations</h2>
    <div class="scroller mt-4 flex gap-x-3 overflow-x-auto pb-2">
      <transition-group name="fade" appear>
        <ShowThumbnail
          v-for="recomendation in recomendations?.results.slice(0, 8)"
          :key="recomendation.id"
          :show="recomendation"
        />
      </transition-group>
    </div>
  </div>
</template>
