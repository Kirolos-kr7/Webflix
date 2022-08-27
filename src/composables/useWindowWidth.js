import { onMounted, onUnmounted, ref } from 'vue'

const useWindowWidth = () => {
  let width = ref(window.innerWidth)

  onMounted(() => {
    window.addEventListener('resize', () => handleResize(), { passive: true })
  })

  onUnmounted(() => {
    window.removeEventListener('resize', () => handleResize())
  })

  const handleResize = () => {
    width.value = window.innerWidth
  }

  return { width }
}

export default useWindowWidth
