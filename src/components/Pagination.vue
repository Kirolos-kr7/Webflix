<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps(['currPage', 'totalPages'])

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
  <div
    class="mx-auto mb-5 grid w-fit grid-cols-2 items-center justify-center gap-2 px-4 xs:flex"
    :class="{ '!flex': currPage == 1 || currPage == totalPages }"
  >
    <button
      v-if="currPage != 1"
      class="flex h-10 w-auto items-center justify-center rounded-md border-4 border-[#07232e] bg-[#012a35] px-8 outline-none hover:bg-[#04232c] focus-visible:ring sm:h-14 sm:w-20"
      @click="$emit('pageChange', '-')"
    >
      {{ 'Prev' }}
    </button>
    <div class="col-span-2 col-start-1 row-start-1 flex items-center gap-2">
      <template v-for="(page, i) in pageRange" :key="i">
        <span v-if="page === '..'"> .. </span>
        <button
          v-else
          class="flex h-10 w-10 items-center justify-center rounded-md border-4 border-[#07232e] bg-[#012a35] px-1.5 text-xs outline-none hover:bg-[#04232c] focus-visible:ring sm:h-14 sm:w-14"
          :class="{
            'border-green-400': page === currPage
          }"
          @click="$emit('pageChange', page)"
        >
          {{ page }}
        </button>
      </template>
    </div>
    <button
      v-if="currPage != totalPages"
      class="flex h-10 w-auto items-center justify-center rounded-md border-4 border-[#07232e] bg-[#012a35] px-8 outline-none hover:bg-[#04232c] focus-visible:ring sm:h-14 sm:w-20"
      @click="$emit('pageChange', '+')"
    >
      {{ 'Next' }}
    </button>
  </div>
</template>
