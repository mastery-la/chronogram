import { Storage } from '@google-cloud/storage'
import cuid from 'cuid'
import { credentials } from '../../util/gcloud-credentials'

const storage = new Storage({ credentials })
const bucket = storage.bucket(process.env.STORAGE_BUCKET || 'chronogram')

export const saveImage = async (data: Buffer): Promise<string> => {
    const id = cuid()
    const filename = `screenshot-${id}.png`
    const file = bucket.file(filename)
    await file.save(data, { public: true })

    return `https://storage.googleapis.com/${bucket.name}/${filename}`
}
