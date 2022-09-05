<script setup>
import Navbar from '../../components/Navbar.vue'
</script>

<template>
  <Navbar />

  <div class="mx-auto w-full max-w-break px-5 py-3 pt-24">
    <RouterView />
  </div>
</template>
