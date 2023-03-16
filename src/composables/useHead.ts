interface metaOptions {
  title?: string
  description?: string
  image?: string
}

const defaultMeta = {
  title: 'Webflix',
  description: 'Webflix movie app',
  image: '/pwa-512x512.png'
}

const useHead = (opts?: metaOptions) => {
  const meta = { ...defaultMeta, ...opts }

  document.title = meta.title
  setTag('og:title', meta.title)
  setTag('og:description', meta.description)
  setTag('og:image', meta.image)
}

const setTag = (property: string, content: any) => {
  let tag = document.querySelector(`[property='${property}']`)
  if (tag) {
    tag.setAttribute('content', content)
    return
  }

  tag = document.createElement('meta')
  tag.setAttribute('property', property)
  tag.setAttribute('content', content)

  document.head.append(tag)
}

export default useHead
