const useIntersectionObserver = (
  el: HTMLElement,
  cb: Function,
  { once = false }
) => {
  if (!el) return

  const observer = new IntersectionObserver((entries) => {
    if (!entries[0].isIntersecting) return

    cb()
    if (once) observer.unobserve(el)
  })

  observer.observe(el)
}

export default useIntersectionObserver
