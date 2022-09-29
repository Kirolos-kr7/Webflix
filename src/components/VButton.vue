<script lang="ts">
export default {
  inheritAttrs: false
}
</script>

<script setup lang="ts">
defineProps(['to'])
</script>

<template>
  <button
    class="overflow-hidden rounded-md bg-emerald-700 shadow hover:bg-emerald-800 disabled:bg-emerald-700/20 disabled:text-gray-400"
    :="$attrs"
    :class="!to ? 'py-2 px-3' : ''"
  >
    <template v-if="to">
      <router-link :to="to" class="block py-2 px-3"><slot /></router-link>
    </template>
    <template v-else>
      <slot />
    </template>
  </button>
</template>
