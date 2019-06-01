import { IncomingMessage, ServerResponse } from 'http'
import { parse } from 'url'
import { isValidURL, formatURL } from './validator'
import { getScreenshot } from './proxy'
import fs from 'fs-extra'

export default async (req: IncomingMessage, res: ServerResponse) => {
    try {
        const { query = {} } = parse(req.url || '', true)
        const { url = '' } = query
        const formattedURL = formatURL(url)

        const payload: RequestScreenshot = {
            url: formattedURL
        }

        if (!isValidURL(formattedURL)) {
            const result: RequestScreenshotResult = {
                ...payload,
                error: 'invalid url',
                success: false
            }

            res.statusCode = 400
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(result))
        } else {
            const file = await getScreenshot(formattedURL)
            await fs.writeFile('/tmp/screenshot.png', file)

            const result: RequestScreenshotResult = {
                ...payload,
                success: true,
                screenshot: 'https://coming.soon/screenshot.png'
            }

            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(result))
        }
    } catch (err) {
        const result: RequestScreenshotResult = {
            url: '',
            error: 'unknown',
            success: false
        }

        console.log(err)
        res.statusCode = 400
        res.setHeader('Content-Type', 'text/json')
        res.end(JSON.stringify(result))
    }
}
