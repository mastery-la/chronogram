import { URL, parse } from 'url'

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
    const [date, time] = iso.split('T')
    const datePath = date.split('-').join('/')
    const timeString = time
        .split(':')
        .slice(0, 2)
        .join('-')
    const folder = `${datePath}/${timeString}`

    return {
        folder,
        url: url.toString(),
        host,
        path: path == '/' ? 'index' : path
    }
}

// export const urlSnapshot = (str: string | string[]): URLSnapshot | null {
//   if (Array.isArray(str)) {
//     return null
//   }
//   return {
//     url: str,
//   }
// }
