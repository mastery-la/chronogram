import { withUiHook, htm, ZeitClient } from '@zeit/integration-utils'

export default withUiHook(
  async ({ payload, zeitClient }): Promise<string> => {
    console.log('PAYLOAD', payload)
    const metadata: { [key: string]: any } = await zeitClient.getMetadata()
    console.log('METADATA', metadata)

    const { teamId, integrationId, configurationId, slug } = payload
    const client = new ZeitClient({
      token: 'J38YcYGizh7XyP2rIfl0wdrg',
      teamId,
      integrationId,
      configurationId,
      slug
    })

    // const { user, team, action, projectId } = payload
    const { action } = payload
    // const ownerId = team ? team.id : user.id
    // const scope = team ? team.slug : user.username
    // const events = EventsStore[ownerId] || []

    if (action == 'enable') {
      await enableWebhook(client)
      metadata['enabled'] = true
      await zeitClient.setMetadata(metadata)
    }

    if (action == 'disable') {
      await disableWebhook(client, 'hook_UnngUSXNyOBWOAho')
      await disableWebhook(client, 'hook_qA0kQKRy8hYSQNZt')

      metadata['enabled'] = false
      await zeitClient.setMetadata(metadata)
    }

    const projectsData = await zeitClient.fetch('/v1/projects/list', {
      method: 'GET'
    })
    const projects = await projectsData.json()
    console.log('projects', projects)

    // const enabled = metadata['enabled'] || false

    return AccountView()
  }
)

const AccountView = () => htm`
  <Page>
    <H1>Hello</H1>
  </Page>
`

const enableWebhook = async (client: ZeitClient) => {
  const res = await client.fetch('/v1/integrations/webhooks', {
    method: 'POST',
    data: {
      name: 'chronogram-webhook',
      url: `${process.env.BASE_URL}/hooks/deployment`
    }
  })
  const json = await res.json()
  console.log('enableWebhook', json)
}

const disableWebhook = async (client: ZeitClient, id: string) => {
  const res = await client.fetch('/v1/integrations/webhooks/' + id, {
    method: 'DELETE'
  })
  console.log('disableWebhook', res)
}
