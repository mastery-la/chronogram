import { Storage } from '@google-cloud/storage'
import { credentials } from '../../util/gcloud-credentials'

const storage = new Storage({ credentials })
const bucket = storage.bucket(process.env.STORAGE_BUCKET || 'chronogram')

export const saveImage = async (
    snapshot: URLSnapshot,
    data: Buffer
): Promise<string> => {
    const { path, host, id } = snapshot
    const filename = `${host}/${id}-${path}.png`
    const file = bucket.file(filename)
    await file.save(data, {
        public: true,
        contentType: 'image/png',

        metadata: {
            'Cache-Control': 'public, s-max-age=31536000, immutable'
        }
    })

    return `https://storage.googleapis.com/${bucket.name}/${filename}`
}
