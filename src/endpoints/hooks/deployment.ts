import { IncomingMessage, ServerResponse } from 'http'
import { json, send } from 'micro'

export default async (req: IncomingMessage, res: ServerResponse) => {
    const data = await json(req)
    console.log(data)
    send(res, 200, data)
}
