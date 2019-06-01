import { IncomingMessage, ServerResponse } from 'http'
import { isValidURL, formatURL } from './validator'
import { getScreenshot } from './proxy'
import { saveImage } from './storage'
import { json, send } from 'micro'

export default async (req: IncomingMessage, res: ServerResponse) => {
    if (req.method != 'POST') {
        send(res, 404)
    }

    try {
        const payload: RequestScreenshotPayload = await json(req)
        const formattedURL = formatURL(payload.url || '')

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
            const imageURL = await saveImage(file)

            const result: RequestScreenshotResult = {
                ...payload,
                success: true,
                screenshot: imageURL
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
