<script setup></script>

<template>
  <img
    src="#"
    class="object-cover opacity-0 transition-opacity duration-500 select-none "
    @load="(e) => e.target.classList.remove('opacity-0')"
  />
</template>
