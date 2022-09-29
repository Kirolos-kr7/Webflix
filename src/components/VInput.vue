<script lang="ts">
export default {
  inheritAttrs: false
}
</script>

<script setup lang="ts">
defineProps(['placeholder'])
</script>

<template>
  <div class="relative w-full">
    <input
      :="$attrs"
      class="peer w-full rounded-md border-2 border-wf-300 bg-transparent px-3 pb-2 pt-3.5 font-medium placeholder:text-transparent focus:outline-none sm:w-[350px]"
      :id="placeholder"
      :placeholder="placeholder"
      readonly
      onfocus="this.removeAttribute('readonly');"
    />
    <label
      class="pointer-events-none absolute top-0.5 left-1.5 -translate-y-1/2 bg-wf-200 px-1.5 text-xs font-semibold text-white transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:font-medium peer-placeholder-shown:text-gray-400 peer-focus:top-0.5 peer-focus:text-xs peer-focus:font-semibold peer-focus:text-white"
      :for="placeholder"
      >{{ placeholder }}</label
    >
  </div>
</template>
