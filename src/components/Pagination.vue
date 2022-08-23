<script setup>
import { computed } from 'vue'

const props = defineProps(['currPage', 'totalPages'])
const currPageRange = computed(() => {
  let pages = Array(5)

  pages[0] = props.currPage - 2
  pages[1] = props.currPage - 1
  pages[2] = props.currPage
  pages[3] = props.currPage + 1
  pages[4] = props.currPage + 2

  pages = pages.filter((p) => p >= 1 && p <= props.totalPages)

  return pages
})
</script>

<template>
  <div class="mb-5 flex items-center justify-center gap-2 px-4">
    <button
      v-if="currPage !== 1"
      class="flex h-14 w-20 items-center justify-center rounded-md border-4 border-[#07232e] bg-[#012a35] px-1.5 hover:bg-[#04232c]"
      @click="$emit('pageChange', '-')"
    >
      Prev
    </button>
    <button
      v-for="page in currPageRange"
      :key="page"
      class="flex h-14 w-14 items-center justify-center rounded-md border-4 border-[#07232e] bg-[#012a35] px-1.5 hover:bg-[#04232c]"
      :class="page === currPage ? 'border-green-400' : ''"
      @click="$emit('pageChange', page)"
    >
      {{ page }}
    </button>
    <button
      v-if="currPage !== totalPages"
      class="flex h-14 w-20 items-center justify-center rounded-md border-4 border-[#07232e] bg-[#012a35] px-1.5 hover:bg-[#04232c]"
      @click="$emit('pageChange', '+')"
    >
      Next
    </button>
  </div>
</template>
