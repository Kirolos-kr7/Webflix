const useMeta = (meta: [property: string, content: string][]) => {
  meta.forEach((m) => {
    let tag = document.querySelector(`[property='${m[0]}']`)
    if (tag) {
      tag.setAttribute('content', m[1])
      return
    }

    tag = document.createElement('meta')
    tag.setAttribute('property', m[0])
    tag.setAttribute('content', m[1])

    document.head.append(tag)
  })
}

export default useMeta
