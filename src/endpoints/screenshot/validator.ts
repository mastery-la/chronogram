import { URL } from 'url'

export const getInt = (str: string | string[]): number | null => {
    if (Array.isArray(str)) {
        return null
    }
    return /[0-9]+/.test(str) ? parseInt(str) : null
}

export const formatURL = (str: string | string[]): string => {
    let url: string
    if (Array.isArray(str)) {
        url = str.join('')
    } else {
        url = str
    }

    if (!url.startsWith('http')) {
        return 'https://' + url
    }
    return url
}

export const isValidURL = (str: string | string[]): boolean => {
    if (Array.isArray(str)) {
        return false
    }
    try {
        const url = new URL(str)
        return url.hostname.includes('.')
    } catch (e) {
        console.error(e.message)
        return false
    }
}
