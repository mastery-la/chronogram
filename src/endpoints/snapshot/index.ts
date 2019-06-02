import { IncomingMessage, ServerResponse } from 'http'
import { formatURL, createURLSnapshot } from './format-url'
import { getScreenshot } from './proxy'
import { saveImage } from './storage'
import { json, send } from 'micro'

export default async (req: IncomingMessage, res: ServerResponse) => {
    if (req.method != 'POST') {
        send(res, 404)
    }

    try {
        const payload: ScreenshotPayload = await json(req)
        const formattedURL = formatURL(payload.url || '')

        if (!formattedURL) {
            const result: ScreenshotResult = {
                ...payload,
                error: 'invalid url',
                success: false
            }

            res.statusCode = 400
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(result))
        } else {
            const snapshot = createURLSnapshot(formattedURL)
            if (!snapshot) {
                throw 'invalid snapshot from url'
            }

            const data = await getScreenshot(formattedURL)
            const imageURL = await saveImage(snapshot, data)

            const result: ScreenshotResult = {
                ...payload,
                success: true,
                screenshot: imageURL
            }

            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(result))
        }
    } catch (err) {
        const result: ScreenshotResult = {
            error: err || 'unknown error',
            success: false
        }

        console.log(err)
        res.statusCode = 400
        res.setHeader('Content-Type', 'text/json')
        res.end(JSON.stringify(result))
    }
}