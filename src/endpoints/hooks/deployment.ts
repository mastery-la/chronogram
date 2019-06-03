import { IncomingMessage, ServerResponse } from 'http'
import { json, send } from 'micro'
import fetch from '../../utils/fetch'
import { Headers } from 'node-fetch'
import * as mongoose from 'mongoose'
import {
  Snapshot,
  ConfigurationModel,
  DeploymentModel,
  Token
} from '../../models'

const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

mongoose.connect(process.env.MONGO_URL || '', { useNewUrlParser: true })

export default async (req: IncomingMessage, res: ServerResponse) => {
  const data: { [key: string]: any } = await json(req)

  const deploymentId = data.payload.deploymentId
  const url = data.payload.url
  const userID: string | null = data.userId || data.teamId || null

  if (!userID) {
    send(res, 400)
    return
  }

  const d = new DeploymentModel()

  const config = await ConfigurationModel.findOne({
    'authorization.userId': userID
  })
  if (!config) {
    return send(res, 400)
  }

  if (config) {
    d.url = url
    d.createdAt = data.createdAt
    d.deploymentId = deploymentId
    d.ownerId = userID
    await d.save()
  }
  const token = config.authorization as Token
  await checkDeploymentReady(token.access_token || '', deploymentId)

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

const checkDeploymentReady = async (
  token: string,
  deploymentId: string
): Promise<boolean> => {
  const url = `https://api.zeit.co/v9/now/deployments/${deploymentId}`
  const headers = new Headers()
  headers.set('Authorization', `Bearer ${token}`)

  let deployment: { [key: string]: any }
  let attempts = 0
  while (true) {
    attempts++
    const data = await fetch(url, {
      method: 'GET',
      headers
    })
    deployment = await data.json()

    if (
      !deployment.readyState ||
      deployment.readyState == 'READY' ||
      deployment.readyState == 'ERROR'
    ) {
      break
    }
    const wait =
      attempts < 10
        ? 3000
        : attempts < 30
        ? 9000
        : attempts < 50
        ? 15000
        : 30000
    await sleep(wait)
  }

  return false
}
