import { IncomingMessage, ServerResponse } from 'http'
import { send } from 'micro'

export default async (_: IncomingMessage, res: ServerResponse) => {
  return send(
    res,
    200,
    `
    <html>
      <head></head>
      <body>
        <h1>hello there</h1>
      </body>
    </html>
  `
  )
}
