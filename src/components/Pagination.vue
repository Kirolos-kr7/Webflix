<script setup>
import { computed } from 'vue'
import useWindowWidth from '../composables/useWindowWidth'

const props = defineProps(['currPage', 'totalPages'])

let { width } = useWindowWidth()

const pageRange = computed(() => {
  const len = 9
  let pages = Array(len)

  if (props.currPage < len / 2) {
    for (let i = 0; i < len; i++) {
      pages[i] = i + 1
    }

    pages[len - 2] = '..'
    pages[len - 1] = props.totalPages
  } else if (props.currPage > props.totalPages - len / 2) {
    for (let i = len, j = 0; i > 0; i--, j++) {
      pages[i] = props.totalPages - j
    }

    pages[1] = '..'
    pages[0] = 1
  } else {
    pages[0] = 1
    pages[1] = '..'
    pages[2] = props.currPage - 2
    pages[3] = props.currPage - 1
    pages[4] = props.currPage
    pages[5] = props.currPage + 1
    pages[6] = props.currPage + 2
    pages[7] = '..'
    pages[8] = props.totalPages
  }

  return pages
})
</script>

<template>
  <div class="mb-5 flex items-center justify-center gap-2 px-4">
    <button
      v-if="currPage !== 1"
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
      v-if="currPage !== totalPages"
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
