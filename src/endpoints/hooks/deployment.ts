import { IncomingMessage, ServerResponse } from 'http'
import { json, send } from 'micro'
import fetch from '../../utils/fetch'

export default async (req: IncomingMessage, res: ServerResponse) => {
    const data: { [key: string]: any } = await json(req)
    console.log(data)

    const url = data.payload.url
    const userID: string | null = data.userId || data.teamId || null

    const snapshot = await fetch(process.env.BASE_URL + '/hooks/snapshot', {
        method: 'POST',
        body: JSON.stringify({
            url,
            userID
        })
    })
    const reply = await snapshot.json()
    console.log('snapshot', reply)

    send(res, 200, data)
}
