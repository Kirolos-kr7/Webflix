<script setup></script>

<template>
  <img
    src="#"
    class="pointer-events-none select-none object-cover opacity-0 transition-opacity duration-500"
    loading="lazy"
    @load="(e) => e.target.classList.remove('opacity-0')"
  />
</template>
