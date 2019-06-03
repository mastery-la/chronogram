import { parse as parseURL } from 'url'
import qs from 'querystring'
import { IncomingMessage, ServerResponse } from 'http'
import fetch from '../../utils/fetch'
import { ZeitClient } from '@zeit/integration-utils'
import { send } from 'micro'
import * as mongoose from 'mongoose'
import { ConfigurationModel, TokenModel, WebhookModel } from '../../models'

mongoose.connect(process.env.MONGO_URL || '', { useNewUrlParser: true })

const CLIENT_ID = 'oac_58Yj1PeseMx29XWIqCBErVrd'
const CLIENT_SECRET = 'yATPBGXg17jnzWClBGDI0h3J'
const REDIRECT_URL = process.env.BASE_URL + '/hooks/installed'
const WEBHOOK_URL = process.env.BASE_URL + '/hooks/deployment'

export default async (req: IncomingMessage, res: ServerResponse) => {
    // only GET requests are part of the OAuth handshake
    if (req.method != 'GET') {
        send(res, 200, 'ok')
        return
    }

    const { query } = parseURL(req.url || '', true)
    console.log('query', query)

    // get an access token
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
    console.log('token res', tokenRes)

    const tokenPayload = await tokenRes.json()
    console.log('token payload', tokenPayload)
    const token: string = tokenPayload['access_token'] || ''

    const teamId = query.teamId
        ? Array.isArray(query.teamId)
            ? query.teamId.join('')
            : query.teamId
        : null

    const c = new ConfigurationModel()
    const t = new TokenModel()
    c.configurationId = query.configurationId as string
    t.access_token = token
    t.userId = tokenPayload['user_id']
    t.teamId = tokenPayload['team_id']
    c.token = t

    // if we have a valid token and team id, we register the webhook
    if (token != '') {
        // @ts-ignore
        const zeitClient = new ZeitClient({
            token,
            teamId
        })
        const hookInfo = await zeitClient.fetchAndThrow(
            `/v1/integrations/webhooks`,
            {
                method: 'POST',
                data: {
                    name: 'default',
                    url: WEBHOOK_URL
                }
            }
        )
        console.log(hookInfo)

        const w = new WebhookModel()
        w.id = hookInfo['id']
        w.name = hookInfo['name']
        w.url = hookInfo['url']
        w.createdAt = hookInfo['createdAt']

        c.webhook = w
        await c.save()
    }

    // and finally, we redirect to fininsh the OAuth flow
    res.writeHead(302, {
        Location: query.next
    })
    res.end('Redirecting...')
}
