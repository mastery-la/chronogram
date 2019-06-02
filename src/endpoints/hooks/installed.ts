import { parse as parseURL } from 'url'
import qs from 'querystring'
import { IncomingMessage, ServerResponse } from 'http'
import fetch from '../../utils/fetch'

const CLIENT_ID = 'oac_58Yj1PeseMx29XWIqCBErVrd'
const CLIENT_SECRET = 'yATPBGXg17jnzWClBGDI0h3J'
const REDIRECT_URL = process.env.BASE_URL + '/hooks/installed'

export default async (req: IncomingMessage, res: ServerResponse) => {
    console.log('redirect-url', REDIRECT_URL)
    const { query } = parseURL(req.url || '', true)
    const tokenRes = await fetch('https://api.zeit.co/v2/oauth/access_token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: qs.stringify({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            code: query.code,
            redirect_uri: REDIRECT_URL
        })
    })

    const tokenPayload = await tokenRes.json()
    console.log(tokenPayload)

    // const token = tokenPayload['access_token']

    res.writeHead(302, {
        Location: query.next
    })
    res.end('Redirecting..')
}
