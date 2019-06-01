import { IncomingMessage, ServerResponse } from 'http'
import { parse } from 'url'
import { isValidURL, formatURL, getInt } from './validator'
import { getScreenshot } from './chromium'

export default async (req: IncomingMessage, res: ServerResponse) => {
    const { query = {} } = parse(req.url || '', true)
    const { url = '', type = 'png', quality = '80', fullPage = true } = query
    const qual = getInt(quality) || 80
    const imageType = !Array.isArray(type) && type == 'jpeg' ? 'jpeg' : 'png'
    const formattedURL = formatURL(url)

    if (!isValidURL(formattedURL)) {
        res.statusCode = 400
        res.setHeader('Content-Type', 'text/json')
        res.end(JSON.stringify({ error: 'invalid url', url: formattedURL }))
    } else {
        const file = await getScreenshot(
            formattedURL,
            imageType,
            qual,
            !!fullPage
        )
        res.statusCode = 200
        res.setHeader('Content-Type', `image/${type}`)
        res.end(file)
    }
}
