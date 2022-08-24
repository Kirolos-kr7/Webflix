<script setup>
import ShowsPage from '../components/ShowsPage.vue'
</script>

<template>
  <ShowsPage
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
