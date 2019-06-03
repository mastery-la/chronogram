import { IncomingMessage, ServerResponse } from 'http'
import { json, send } from 'micro'
import fetch from '../../utils/fetch'
import * as mongoose from 'mongoose'
import { ConfigurationModel, DeploymentModel } from '../../models'
import { Snapshot } from '../../models/snapshot'

mongoose.connect(process.env.MONGO_URL || '', { useNewUrlParser: true })

export default async (req: IncomingMessage, res: ServerResponse) => {
    const data: { [key: string]: any } = await json(req)
    console.log(data)

    const deploymentId = data.payload.deploymentId
    const url = data.payload.url
    const userID: string | null = data.userId || data.teamId || null

    const d = new DeploymentModel()

    if (data.userId) {
        const config = await ConfigurationModel.findOne({
            'token.userId': userID
        })
        if (config) {
            d.url = url
            d.createdAt = data.createdAt
            d.deploymentId = deploymentId
            await d.save()

            await config.updateOne({ $push: { deployments: d } })
        }
        console.log('configuration', config)
    }

    const snapshot = await fetch(process.env.BASE_URL + '/hooks/snapshot', {
        method: 'POST',
        body: JSON.stringify({
            url,
            userID,
            deploymentId
        })
    })
    const reply: ScreenshotResult = await snapshot.json()
    console.log('snapshot', reply)

    const s = new Snapshot()
    s.webpageURL = reply.url
    s.screenshotURL = reply.screenshot
    d.snapshot = s
    await d.save()

    send(res, 200, data)
}
