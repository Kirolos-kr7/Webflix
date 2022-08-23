const useIntersectionObserver = (el, cb, { once = false }) => {
  if (!el) return

  let observer = new IntersectionObserver((entries) => {
    if (!entries[0].isIntersecting) return

    cb()
    if (once) observer.unobserve(el)
  })

  observer.observe(el)
}

export default useIntersectionObserver
