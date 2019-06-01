import fetch from '../../util/fetch'

const screenshotService = 'https://screenshot-v2.now.sh'

export const getScreenshot = async (
    url: string,
    type: 'jpeg' | 'png' = 'png',
    quality: number = 80,
    fullPage: boolean = true
): Promise<Buffer> => {
    console.log(url, type, quality, fullPage)
    const fetchURL = `${screenshotService}/${url}?fullPage=true`
    const data = await fetch(fetchURL)
    const blob = await data.blob()

    console.log('blob', blob)

    return blob
}
