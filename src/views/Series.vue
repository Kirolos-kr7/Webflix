<script setup>
import ShowsPage from '../components/ShowsPage.vue'
</script>

<template>
  <ShowsPage
    name="Series"
    resource="tv"
    :showModes="[
      { mode: 'popular', title: 'Popular' },
      { mode: 'on_the_air', title: 'On The Air' },
      { mode: 'top_rated', title: 'Top Rated' }
    ]"
  />
</template>
