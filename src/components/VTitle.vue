<script setup>
const props = defineProps(["title"]);
</script>

<template>
  <div class="relative">
    <h1 class="text-4xl font-semibold relative z-10">{{ title }}</h1>
    <transition name="fadeIn" appear>
      <h1
        class="z-0 text-9xl top-2 -translate-y-12 -translate-x-14 font-black absolute text-black/30 select-none pointer-events-none w-screen overflow-hidden py-3"
      >
        {{ title }}
      </h1>
    </transition>
  </div>
</template>
