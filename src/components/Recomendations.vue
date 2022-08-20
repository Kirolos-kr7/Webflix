<script setup>
import axios from "axios";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import ShowThumbnail from "./ShowThumbnail.vue";
import useIntersectionObserver from "../composables/IntersectionObserver";

const recs = ref();
const recomendations = ref();
const props = defineProps(["type"]);
const route = useRoute();

onMounted(async () => {
  useIntersectionObserver(
    recs.value,
    async () => {
      let recRes = await axios.get(
        `https://api.themoviedb.org/3/${props.type}/${route.params.id}/recommendations?api_key=18cfdbd5b22952a0c5c289fbbf02c827`
      );
      recomendations.value = await recRes.data;
    },
    { once: true }
  );
});
</script>

<template>
  <div class="px-5 py-10 w-full max-w-break mx-auto" ref="recs">
    <h2 class="text-3xl font-semibold">Recomendations</h2>
    <div class="flex gap-x-3 mt-4 overflow-x-auto scroller pb-2">
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
