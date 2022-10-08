<script setup lang="ts">
import { computed } from 'vue'
import useWindowWidth from '../composables/useWindowWidth'

const props = defineProps(['currPage', 'totalPages'])

let { width } = useWindowWidth()

const pageRange = computed(() => {
  const LEN = 5
  let pages = Array(LEN)

  pages[0] = parseInt(props.currPage) - 2
  pages[1] = parseInt(props.currPage) - 1
  pages[2] = parseInt(props.currPage)
  pages[3] = parseInt(props.currPage) + 1
  pages[4] = parseInt(props.currPage) + 2

  pages = pages.filter((page) => page >= 1 && page <= props.totalPages)

  if (
    pages[pages.length - 1] < props.totalPages &&
    !pages.includes(props.totalPages)
  ) {
    pages.push('..')
    pages.push(props.totalPages)
  }

  if (!pages.includes(1)) {
    pages.unshift('..')
    pages.unshift(1)
  }

  return pages
})
</script>

<template>
  <div class="mb-5 flex items-center justify-center gap-2 px-4">
    <button
      v-if="currPage != 1"
      class="flex h-14 w-20 items-center justify-center rounded-md border-4 border-[#07232e] bg-[#012a35] px-1.5 hover:bg-[#04232c]"
      @click="$emit('pageChange', '-')"
      :class="{
        'h-10 w-10 text-xs': width < 600
      }"
    >
      {{ width < 600 ? 'P' : 'Prev' }}
    </button>
    <template v-for="(page, i) in pageRange" :key="i">
      <span v-if="page === '..'"> .. </span>
      <button
        v-else
        class="flex h-14 w-14 items-center justify-center rounded-md border-4 border-[#07232e] bg-[#012a35] px-1.5 hover:bg-[#04232c]"
        :class="{
          'border-green-400': page === currPage,
          'h-10 w-10 text-xs': width < 600
        }"
        @click="$emit('pageChange', page)"
      >
        {{ page }}
      </button>
    </template>
    <button
      v-if="currPage != totalPages"
      class="flex h-14 w-20 items-center justify-center rounded-md border-4 border-[#07232e] bg-[#012a35] px-1.5 hover:bg-[#04232c]"
      @click="$emit('pageChange', '+')"
      :class="{
        'h-10 w-10 text-xs': width < 600
      }"
    >
      {{ width < 600 ? 'N' : 'Next' }}
    </button>
  </div>
</template>
