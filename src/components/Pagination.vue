<script setup>
import { computed } from "@vue/reactivity";

const props = defineProps(["currPage", "totalPages"]);
const currPageRange = computed(() => {
  let pages = Array(5);

  pages[0] = props.currPage - 2;
  pages[1] = props.currPage - 1;
  pages[2] = props.currPage;
  pages[3] = props.currPage + 1;
  pages[4] = props.currPage + 2;

  pages = pages.filter((p) => p >= 1 && p <= props.totalPages);

  return pages;
});
</script>

<template>
  <div class="flex items-center justify-center gap-2 mb-5 px-4">
    <button
      v-if="currPage !== 1"
      class="flex items-center justify-center w-20 h-14 px-1.5 border-4 rounded-md bg-[#012a35] hover:bg-[#04232c] border-[#07232e]"
      @click="$emit('pageChange', '-')"
    >
      Prev
    </button>
    <button
      v-for="page in currPageRange"
      :key="page"
      class="flex items-center justify-center w-14 h-14 px-1.5 border-4 rounded-md bg-[#012a35] hover:bg-[#04232c] border-[#07232e]"
      :class="page === currPage ? 'border-green-400' : ''"
      @click="$emit('pageChange', page)"
    >
      {{ page }}
    </button>
    <button
      v-if="currPage !== totalPages"
      class="flex items-center justify-center w-20 h-14 px-1.5 border-4 rounded-md bg-[#012a35] hover:bg-[#04232c] border-[#07232e]"
      @click="$emit('pageChange', '+')"
    >
      Next
    </button>
  </div>
</template>
