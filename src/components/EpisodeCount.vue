<script lang="ts">
import { h, type PropType, type VNode } from 'vue'

export default {
  props: {
    count: {
      type: Number as PropType<number>,
      default: 0
    }
  },
  setup(props) {
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
