<script setup lang="ts">
import type { Season } from '../types'
import SeasonThumbnail from './SeasonThumbnail.vue'

defineProps<{
  seasons: Season[]
  showId: number
}>()
</script>

<template>
  <div class="mx-auto w-full max-w-break px-5 py-10">
    <h2 class="text-3xl font-semibold">Seasons</h2>
    <div class="scroller mt-4 flex gap-x-3 overflow-x-auto pb-2">
      <transition-group name="fade" appear>
        <SeasonThumbnail
          v-for="season in seasons"
          :key="season.id"
          :season="season"
          :showId="showId"
        />
      </transition-group>
    </div>
  </div>
</template>
