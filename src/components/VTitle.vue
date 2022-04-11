<script setup>
const props = defineProps(["title"]);
</script>

<template>
  <h1 class="text-4xl font-semibold relative z-10">{{ title }}</h1>
  <transition name="fadeIn" appear>
    <h1
      class="
        z-0
        text-9xl
        -translate-x-14
        translate-y-6
        font-black
        absolute
        text-black/30
        select-none
        pointer-events-none
        overflow-hidden
        w-[calc(100%+2.2rem)]
      "
    >
      {{ title }}
    </h1>
  </transition>
</template>
