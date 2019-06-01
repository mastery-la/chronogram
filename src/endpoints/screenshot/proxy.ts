import fetch from '../../util/fetch'
import { URL } from 'url'

const screenshotService = 'https://screenshot-v2.now.sh'

export const getScreenshot = async (url: URL): Promise<Buffer> => {
    const fetchURL = `${screenshotService}/${url}?fullPage=true`
    const data = await fetch(fetchURL)
    const blob = await data.buffer()

    return blob
}
