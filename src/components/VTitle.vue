<script setup lang="ts">
defineProps(['title'])
</script>

<template>
  <div class="relative">
    <h1 class="relative z-10 text-4xl font-semibold">{{ title }}</h1>
    <transition name="fadeIn" appear>
      <h1
        class="pointer-events-none absolute top-2 z-0 w-screen max-w-[fit-content] -translate-y-12 -translate-x-14 select-none overflow-hidden py-3 text-9xl font-black text-black/30"
      >
        {{ title }}
      </h1>
    </transition>
  </div>
</template>
