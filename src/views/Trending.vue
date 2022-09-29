<script setup lang="ts">
import ShowsPage from '../components/ShowsPage.vue'
</script>

<template>
  <ShowsPage
    name="Trending"
    resource="trending"
    :showModes="[
      { mode: 'all', title: 'All' },
      { mode: 'movie', title: 'Movie' },
      { mode: 'tv', title: 'TV' }
    ]"
  />
</template>
