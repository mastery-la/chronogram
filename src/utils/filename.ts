export const screenshotFilename = (snapshot: URLSnapshot): string => {
    const { path, host, id } = snapshot
    const pageName = path.replace('/', '-')
    return `${host}/${id}-${encodeURIComponent(pageName)}.png`
}
