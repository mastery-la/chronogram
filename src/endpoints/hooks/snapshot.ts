import { IncomingMessage, ServerResponse } from 'http'
import { json, send } from 'micro'
import { formatURL, createURLSnapshot } from '../../utils/format-url'
import { getScreenshot } from '../../utils/proxy'
import { saveImage } from '../../utils/storage'

export default async (req: IncomingMessage, res: ServerResponse) => {
  if (req.method != 'POST') {
    send(res, 404)
  }

  try {
    const payload: ScreenshotPayload = await json(req)
    console.log('payload', payload)
    const formattedURL = formatURL(payload.url || '')
    const userID = payload.userID
      ? Array.isArray(payload.userID)
        ? payload.userID.join('')
        : payload.userID
      : null

    if (!userID) {
      const result: ScreenshotResult = {
        ...payload,
        error: 'must provide userID',
        success: false
      }

      res.statusCode = 400
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(result))

      return
    }

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
      const imageURL = await saveImage(userID, snapshot, data)

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
