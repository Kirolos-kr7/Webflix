<script setup lang="ts">
import VButton from './VButton.vue'

defineProps<{ litc: Boolean }>()
defineEmits(['closeLitc'])
</script>

<template>
  <transition name="fadeIn">
    <div
      class="fixed inset-0 z-40 grid min-h-screen w-full place-content-center bg-transparent backdrop-blur-sm"
      v-if="litc"
    >
      <div
        class="absolute inset-0 h-full w-full bg-black/60 transition-all"
        @click="$emit('closeLitc')"
      />
      <div
        class="relative grid min-w-[340px] gap-5 rounded-md border border-wf-100/50 bg-wf-300 p-5"
      >
        <h2 class="text-xl font-semibold">Please Login To Continue</h2>
        <VButton to="/auth">Login Now</VButton>
      </div>
    </div>
  </transition>
</template>
