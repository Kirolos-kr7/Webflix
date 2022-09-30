<script setup lang="ts">
import ShowsGrid from '../components/ShowsGrid.vue'
</script>

<template>
  <ShowsGrid
    name="Trending"
    resource="trending"
    :showModes="[
      { mode: 'all', title: 'All' },
      { mode: 'movie', title: 'Movie' },
      { mode: 'tv', title: 'TV' }
    ]"
  />
</template>
