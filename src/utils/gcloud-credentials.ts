const serviceAccount = Buffer.from(
    process.env.GCLOUD_CREDENTIALS || '',
    'base64'
)

export const credentials = JSON.parse(serviceAccount.toString())
