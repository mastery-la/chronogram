import { withUiHook, htm as html } from '@zeit/integration-utils'

let count = 0

export default withUiHook(
  async (): Promise<string> => {
    count += 1
    return html`
      <Page>
        <p>Counter: ${count}</p>
        <button>Count Me</button>
      </Page>
    `
  }
)
