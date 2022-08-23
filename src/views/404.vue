<script setup>
import { onMounted } from 'vue'
import Navbar from '../components/Navbar.vue'
import VImage from '../components/VImage.vue'

onMounted(() => {
  document.title = `404 - Webflix`
})
</script>

<template>
  <Navbar />
  <div class="relative min-h-screen w-full overflow-x-hidden bg-[#032c37]">
    <VImage
      class="absolute !left-1/2 z-0 max-h-screen min-h-[65vh] !-translate-x-1/2 object-cover xs:min-h-[75vh] md:!min-h-screen md:translate-x-40 lg:translate-x-60 xl:translate-x-72 2xl:translate-x-80"
      src="/the-matrix-resurrections.jpg"
    />
    <div
      class="overlay absolute top-0 left-0 z-10 h-full max-h-screen w-full p-3 transition-opacity"
    ></div>
    <div
      class="overlay absolute top-0 right-0 z-10 hidden h-full max-h-screen w-full rotate-180 p-3 transition-opacity md:block"
    ></div>
    <div
      class="absolute bottom-20 z-10 flex w-full flex-col items-center justify-center"
    >
      <h1 class="text-9xl font-black">404</h1>
      <router-link
        to="/"
        class="rounded-md bg-darkblue-300 px-4 py-1.5 transition-colors hover:bg-darkblue-300/60"
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
