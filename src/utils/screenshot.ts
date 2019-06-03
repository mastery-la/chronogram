import * as chrome from 'chrome-aws-lambda'
import * as puppeteer from 'puppeteer-core'

export async function getScreenshot(
  url: string,
  type: 'png' | 'jpeg' = 'png'
): Promise<Buffer> {
  const browser = await puppeteer.launch({
    defaultViewport: {
      width: 1440,
      height: 900,
      deviceScaleFactor: 2
    },
    args: chrome.args,
    executablePath: await chrome.executablePath,
    headless: chrome.headless
  })

  const page = await browser.newPage()
  await page.goto(url, { waitUntil: 'networkidle2' })
  const file = await page.screenshot({ type, fullPage: true })
  await browser.close()
  return file
}
