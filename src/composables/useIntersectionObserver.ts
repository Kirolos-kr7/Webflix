const useIntersectionObserver = (
  el: HTMLElement | undefined,
  cb: Function,
  { once = false }
) => {
  if (!el) {
    throw new Error('There is no element to observe')
    return
  }

  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries[0].isIntersecting) return
      console.log('xxx')

      cb()
      if (once) observer.unobserve(el)
    },
    {
      rootMargin: '200px'
    }
  )

  observer.observe(el)
}

export default useIntersectionObserver
