import type { DirectiveBinding } from 'vue'

const vTooltip = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    el.addEventListener('mouseenter', () => getTooltip(el, binding))
    el.addEventListener('mouseleave', () => removeTooltip())
  },
  unmounted(el: HTMLElement) {
    el.removeEventListener('mouseenter', () => getTooltip())
    el.removeEventListener('mouseleave', () => removeTooltip())
  }
}

export default vTooltip

const getTooltip = (
  el?: HTMLElement | undefined,
  binding?: DirectiveBinding
) => {
  if (binding && Object.keys(binding.modifiers).length > 1)
    throw new Error('Only 1 Modifier is allowed (Left, Right or Center).')

  let origin = ''
  if (binding?.modifiers.left) origin = 'l'
  if (binding?.modifiers.right) origin = 'r'
  if (binding?.modifiers.center) origin = 'c'

  if (!origin) origin = 'c'

  if (!el || !binding || navigator.userAgentData?.mobile) return
  const rect = el.getBoundingClientRect()

  const styles = `v-tooltip top-0 left-0 bg-[#00141a] p-2 duration-200 rounded-md z-[100] absolute text-xs shadow-xl border border-wf-200/80 transition-opacity opacity-0`

  const tooltip = document.createElement('div')
  styles.split(' ').forEach((cls) => {
    tooltip.classList.add(cls)
  })
  tooltip.textContent = binding.value

  const isExisting = document.body.querySelectorAll('.v-tooltip')
  if (isExisting) Array.from(isExisting).forEach((elem) => elem.remove())
  document.body.append(tooltip)

  const cords = {
    x: rect.x + rect.width / 2 - tooltip.offsetWidth / 2,
    y:
      window.innerHeight - rect.bottom < tooltip.offsetHeight
        ? window.scrollY + rect.top - tooltip.offsetHeight - 5
        : window.scrollY + rect.top + rect.height
  }

  if (origin === 'r') cords.x = rect.x - tooltip.offsetWidth / 2 + 5
  if (origin === 'l') cords.x = rect.right - tooltip.offsetWidth / 2 - 5

  tooltip.style.transformOrigin = 'center'
  tooltip.style.transform = `translate(${cords.x}px,${cords.y}px)`

  setTimeout(() => {
    tooltip.classList.remove('opacity-0')
  }, 200)
}

const removeTooltip = () => {
  const tooltip: HTMLElement | null = document.body.querySelector('.v-tooltip')
  if (tooltip) {
    tooltip.classList.add('opacity-0')
    setTimeout(() => tooltip.remove(), 200)
  }
}
