<script setup>
import ShowThumbnail from "./ShowThumbnail.vue";
const props = defineProps(["recomendations"]);
</script>

<template>
  <div class="px-5 py-10 w-full max-w-break mx-auto">
    <h2 class="text-3xl font-semibold">Recomendations</h2>
    <div class="flex gap-x-3 mt-4 overflow-x-auto scroller pb-2">
      <transition-group name="fade" appear>
        <div
          v-for="recomendation in recomendations?.results.slice(0, 8)"
          :key="recomendation.id"
          class="transition-all min-w-[280px] max-w-[280px]"
        >
          <ShowThumbnail :show="recomendation" />
        </div>
      </transition-group>
    </div>
  </div>
</template>
