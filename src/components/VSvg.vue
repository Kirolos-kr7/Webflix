<script lang="ts">
export default {
  inheritAttrs: false
}
</script>

<script setup lang="ts">
defineProps(['d'])
</script>

<template>
  <svg
    class="h-5 w-5"
    :="$attrs"
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path fill-rule="evenodd" :d="d" clip-rule="evenodd"></path>
  </svg>
</template>
