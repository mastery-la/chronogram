export const screenshotFilename = (snapshot: URLSnapshot): string => {
    const { path, host, folder } = snapshot
    const pageName = path.replace('/', '-')
    return `${host}/${folder}-${encodeURIComponent(pageName)}.png`
}
