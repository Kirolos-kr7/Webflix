<template>
  <router-view v-slot="{ Component }">
    <transition name="fadeIn" mode="out-in" appear>
      <div class="min-h-screen">
        <component :is="Component"></component>
      </div>
    </transition>
    <Footer />
    <Toast />
  </router-view>
</template>

<script setup>
import Footer from './components/Footer.vue'
import Toast from './components/Toast.vue'
</script>
