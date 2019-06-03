import { URL, parse } from 'url'
import { slug } from 'cuid'

export const formatURL = (str: string | string[]): URL | null => {
  let url: string
  if (Array.isArray(str)) {
    url = str.join('')
  } else {
    url = str
  }

  try {
    if (!url.startsWith('http')) {
      return new URL('https://' + url)
    }
    return new URL(url)
  } catch (e) {
    console.error(e.message)
    return null
  }
}

export const createURLSnapshot = (url: URL): URLSnapshot | null => {
  const { host, path } = parse(url.toString())
  if (!host || !path) {
    return null
  }
  const now = new Date()
  const iso = now.toISOString()
  const [date] = iso.split('T')
  const folder = `${date}-${slug()}`

  return {
    folder,
    url: url.toString(),
    host,
    path: path == '/' ? 'index' : path
  }
}
