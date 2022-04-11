<script setup>
import { onMounted } from "@vue/runtime-core";
import Navbar from "../components/Navbar.vue";

onMounted(() => {
  document.title = `404 - Webflix`;
});
</script>

<template>
  <Navbar />
  <div class="relative min-h-screen overflow-x-hidden bg-[#032c37] w-full">
    <img
      class="object-cover z-0 min-h-[65vh] xs:min-h-[75vh] md:!min-h-screen max-h-screen md:translate-x-40 lg:translate-x-60 xl:translate-x-72 2xl:translate-x-80 absolute !left-1/2 !-translate-x-1/2"
      src="/the-matrix-resurrections.jpg"
    />
    <div
      class="overlay absolute z-10 top-0 left-0 p-3 w-full h-full transition-opacity max-h-screen"
    ></div>
    <div
      class="hidden md:block overlay absolute z-10 top-0 right-0 rotate-180 p-3 w-full h-full transition-opacity max-h-screen"
    ></div>
    <div
      class="absolute z-10 bottom-20 flex flex-col items-center w-full justify-center"
    >
      <h1 class="text-9xl font-black">404</h1>
      <router-link
        to="/"
        class="bg-darkblue-300 hover:bg-darkblue-300/60 transition-colors px-4 py-1.5 rounded-md"
      >
        Check Trending Shows
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  background: linear-gradient(to left, transparent 60%, rgb(3 44 55) 80%);
}

@media screen and (max-width: 768px) {
  .overlay {
    background: linear-gradient(to bottom, transparent 60%, rgb(3 44 55) 75%);
  }
}

@media screen and (max-width: 450px) {
  .overlay {
    background: linear-gradient(to bottom, transparent 40%, rgb(3 44 55) 60%);
  }
}
</style>
