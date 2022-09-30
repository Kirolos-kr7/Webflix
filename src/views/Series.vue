<script setup lang="ts">
import ShowsGrid from '../components/ShowsGrid.vue'
</script>

<template>
  <ShowsGrid
    name="Series"
    resource="tv"
    :showModes="[
      { mode: 'popular', title: 'Popular' },
      { mode: 'on_the_air', title: 'On The Air' },
      { mode: 'top_rated', title: 'Top Rated' }
    ]"
  />
</template>
