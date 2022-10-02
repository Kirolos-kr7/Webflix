<script lang="ts">
import { h, type VNode } from 'vue'

export default {
  props: {
    count: Number
  },
  setup(props: { count: number }) {
    let txt: string = ''
    let num: any = 0

    const getNumWZeros = (x: number): string =>
      new Intl.NumberFormat('en-us', {
        minimumIntegerDigits: 3
      }).format(x)

    num = getNumWZeros(props.count)

    txt += num.toString() + 'Episodes'
    const spans: VNode[] = []
    Array.from(txt).forEach((c) =>
      spans.push(h('span', { class: 'text-center px-0.5' }, c))
    )
    return () => spans
  }
}
</script>
