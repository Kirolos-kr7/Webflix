<script setup lang="ts">
import { ref } from 'vue'
const imgLoaded = ref(false)
</script>

<template>
  <img
    src="#"
    class="select-none object-cover transition-opacity duration-500"
    :class="{ 'opacity-0': !imgLoaded }"
    loading="lazy"
    @load="imgLoaded = true"
  />
</template>
