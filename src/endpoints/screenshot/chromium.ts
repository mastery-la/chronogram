import * as chrome from 'chrome-aws-lambda'
import * as puppeteer from 'puppeteer-core'

export const getScreenshot = async (
    url: string,
    type: 'jpeg' | 'png' = 'png',
    quality: number = 80,
    fullPage: boolean = true
): Promise<Buffer> => {
    const browser = await puppeteer.launch({
        args: chrome.args,
        executablePath: await chrome.executablePath,
        headless: chrome.headless
    })

    const page = await browser.newPage()
    await page.goto(url)
    const file = await page.screenshot({ type, quality, fullPage })
    await browser.close()

    return file
}
