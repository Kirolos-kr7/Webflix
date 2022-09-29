const vTooltip = {
  mounted(el: HTMLElement, binding: { value: string }) {
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
  binding?: { value: string }
) => {
  if (!el || !binding) return
  const rect = el.getBoundingClientRect()

  const styles = `v-tooltip bg-[#00141a] p-2 rounded-md z-[100] absolute text-xs shadow-xl border border-wf-200/80 transition-opacity opacity-0`

  const tooltip = document.createElement('div')
  styles.split(' ').forEach((cls) => {
    tooltip.classList.add(cls)
  })
  tooltip.textContent = binding.value
  document.body.append(tooltip)

  const cords = {
    x:
      window.innerWidth - rect.x > tooltip.offsetWidth
        ? rect.x + rect.width / 2 - tooltip.offsetWidth / 2
        : rect.x - rect.width / 2 - tooltip.offsetWidth / 2,
    y:
      window.innerHeight - rect.bottom < tooltip.offsetHeight
        ? window.scrollY + rect.top - tooltip.offsetHeight - 5
        : window.scrollY + rect.top + rect.height + 5
  }

  if (cords.x < tooltip.offsetWidth) cords.x = 25

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
