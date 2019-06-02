import { Storage } from '@google-cloud/storage'
import { credentials } from '../../utils/gcloud-credentials'
import { screenshotFilename } from '../../utils/filename'

const storage = new Storage({ credentials })
const bucket = storage.bucket(process.env.STORAGE_BUCKET || 'chronogram')

export const saveImage = async (
    snapshot: URLSnapshot,
    data: Buffer
): Promise<string> => {
    const filename = screenshotFilename(snapshot)
    const file = bucket.file(filename)
    await file.save(data, {
        public: true,
        metadata: {
            'Cache-Control': 'public, s-max-age=31536000, immutable'
        }
    })

    return `https://storage.googleapis.com/${bucket.name}/${filename}`
}
