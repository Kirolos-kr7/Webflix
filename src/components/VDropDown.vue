<script setup lang="ts">
import { ref, computed } from 'vue'
import VSvg from './VSvg.vue'

const isExpanded = ref(false),
  btn = ref(),
  props = defineProps<{
    options: any[]
    selected: any
    textKey: string
    valueKey: string
  }>()

defineEmits(['selectionChange'])

const opts = computed(() => {
  let { options, selected } = props
  return options.filter(
    (opt) => opt[props.valueKey] != selected[props.valueKey]
  )
})

const toggleMenu = () => {
  if (opts.value.length > 0) isExpanded.value = !isExpanded.value
  if (isExpanded.value) {
    window.addEventListener(
      'mouseup',
      (evt: MouseEvent) => {
        if (evt.target != btn.value) isExpanded.value = false
      },
      { once: true }
    )
  }
}
</script>

<template>
  <div
    class="relative h-max rounded-md bg-wf-200 transition-all hover:bg-wf-200/70"
    :class="{ 'rounded-b-none': isExpanded }"
  >
    <button
      @click="toggleMenu()"
      ref="btn"
      class="flex w-full cursor-pointer justify-between px-4 py-1.5 text-left"
    >
      {{ selected[textKey] }}
      <VSvg
        class="pointer-events-none mt-0.5 transition-all"
        :class="{
          '-rotate-90': !isExpanded,
          '!text-gray-500': opts.length == 0
        }"
        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
      />
    </button>
    <transition>
      <div
        class="absolute z-20 max-h-72 w-full overflow-hidden rounded-b-md shadow-md"
      >
        <ul
          v-if="isExpanded"
          class="diff flex max-h-72 cursor-pointer flex-col overflow-auto [&>li]:bg-wf-200 [&>li]:px-4 [&>li]:py-0.5 [&>li]:text-gray-400 [&>li]:transition-colors [&>li:hover]:bg-wf-100"
        >
          <li
            v-for="opt in opts"
            :key="opt[valueKey]"
            @mousedown="
              () => {
                $emit('selectionChange', opt[valueKey])
                isExpanded = false
              }
            "
          >
            {{ opt[textKey] }}
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>
