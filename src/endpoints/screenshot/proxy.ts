import fetch from '../../util/fetch'

const screenshotService = 'https://screenshot-v2.now.sh'

export const getScreenshot = async (url: string): Promise<Buffer> => {
    const fetchURL = `${screenshotService}/${url}?fullPage=true`
    const data = await fetch(fetchURL)
    const blob = await data.buffer()

    return blob
}
