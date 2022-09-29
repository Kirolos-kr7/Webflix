<script setup lang="ts">
import SeasonThumbnail from './SeasonThumbnail.vue'

defineProps(['seasons'])
</script>

<template>
  <div
    class="relative mx-auto w-full max-w-break bg-wf-300 px-5 py-10"
    ref="recs"
  >
    <h2 class="text-3xl font-semibold">Seasons</h2>
    <div class="scroller mt-4 flex gap-x-3 overflow-x-auto pb-2">
      <transition-group name="fade" appear>
        <SeasonThumbnail
          v-for="season in seasons"
          :key="season.id"
          :season="season"
        />
      </transition-group>
    </div>
  </div>
</template>
