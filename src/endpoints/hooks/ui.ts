import { withUiHook, htm, ZeitClient } from '@zeit/integration-utils'

export default withUiHook(
    async ({ payload, zeitClient }): Promise<string> => {
        console.log('PAYLOAD', payload)
        const metadata: { [key: string]: any } = await zeitClient.getMetadata()
        console.log('METADATA', metadata)

        const { token, teamId, integrationId, configurationId, slug } = payload
        const client = new ZeitClient({
            token,
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
            await disableWebhook(client)
            metadata['enabled'] = false
            await zeitClient.setMetadata(metadata)
        }

        const enabled = metadata['enabled'] || false

        return AccountView({ enabled })
    }
)

const AccountView = ({ enabled }: { enabled: boolean }) => htm`
  <Page>
    ${
        enabled
            ? htm`<Button warning action="disable">Disable Chronogram</Button>`
            : htm`<Button secondary action="enable">Enable Chronogram</Button>`
    }      
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
const disableWebhook = async (client: ZeitClient) => {
    console.log('client', client)
}
