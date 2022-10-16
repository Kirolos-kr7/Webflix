<template>
  <Navbar />
  <router-view v-slot="{ Component }">
    <transition name="fadeIn" mode="out-in" appear>
      <main class="min-h-screen">
        <button class="skipper absolute" tabindex="-1" />
        <component :is="Component"></component>
      </main>
    </transition>
    <Footer />
    <Toast />
  </router-view>
</template>

<script setup lang="ts">
import Footer from './components/Footer.vue'
import Toast from './components/Toast.vue'
import Navbar from './components/Navbar.vue'
</script>
