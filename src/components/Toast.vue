<script setup>
import VSvg from './VSvg.vue'
import { useStore } from '../store'
import useWindowWidth from '../composables/useWindowWidth'

const { width } = useWindowWidth()
const store = useStore()
</script>

<template>
  <div
    class="fixed bottom-0 right-0 z-50 flex w-full flex-col-reverse gap-y-2 py-3 px-5 xs:w-96"
  >
    <transition-group :name="width > 450 ? 'toast' : 'toastUp'">
      <div
        v-for="{ msg, redirect, status, id } in store.toastList"
        :key="id"
        class="flex items-center justify-between gap-3 rounded-md border border-wf-100/50 bg-[#00151bdd] px-5 py-3 shadow-xl backdrop-blur-sm"
      >
        <VSvg
          class="rounded-full p-0.5"
          :class="!status ? 'bg-red-600' : 'bg-green-600'"
          :d="
            !status
              ? 'M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
              : 'M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
          "
        />

        <div class="flex-1">
          <div>
            {{ msg }}
          </div>
          <router-link
            class="text-sm text-green-400 hover:text-green-500"
            v-if="redirect"
            :to="redirect"
            >CLICK HERE</router-link
          >
        </div>
        <button
          class="rounded-md p-0.5 hover:bg-wf-100/60"
          @click="store.removeToast(id)"
        >
          <VSvg
            class="h-4 w-4"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
          />
        </button>
      </div>
    </transition-group>
  </div>
</template>
