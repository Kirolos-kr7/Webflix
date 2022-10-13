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

  if (!origin)
    throw new Error(
      'One of these modifiers (Left, Right or Center) is required.'
    )

  if (!el || !binding || navigator.userAgentData?.mobile) return
  const rect = el.getBoundingClientRect()

  const styles = `v-tooltip bg-[#00141a] p-2 rounded-md z-[100] absolute text-xs shadow-xl border border-wf-200/80 transition-opacity opacity-0`

  const tooltip = document.createElement('div')
  styles.split(' ').forEach((cls) => {
    tooltip.classList.add(cls)
  })
  tooltip.textContent = binding.value
  document.body.append(tooltip)

  const cords = {
    x: rect.x + rect.width / 2 - tooltip.offsetWidth / 2,
    y:
      window.innerHeight - rect.bottom < tooltip.offsetHeight
        ? window.scrollY + rect.top - tooltip.offsetHeight - 5
        : window.scrollY + rect.top + rect.height
  }

  if (origin === 'r') cords.x = rect.x - tooltip.offsetWidth / 2 - 2
  if (origin === 'l') cords.x = rect.right - tooltip.offsetWidth / 2 + 2

  tooltip.style.top = cords.y + 'px'
  tooltip.style.left = cords.x + 'px'

  setTimeout(() => {
    tooltip.classList.remove('opacity-0')
  }, 250)
}

const removeTooltip = () => {
  const tooltip: HTMLElement | null = document.body.querySelector('.v-tooltip')
  if (tooltip) tooltip.remove()
}
