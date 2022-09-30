<script setup lang="ts">
import ShowsGrid from '../components/ShowsGrid.vue'
</script>

<template>
  <ShowsGrid
    name="Movies"
    resource="movie"
    :showModes="[
      { mode: 'popular', title: 'Popular' },
      { mode: 'now_playing', title: 'Now Playing' },
      { mode: 'top_rated', title: 'Top Rated' },
      { mode: 'upcoming', title: 'Upcoming' }
    ]"
  />
</template>
