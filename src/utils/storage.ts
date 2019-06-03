import { Storage } from '@google-cloud/storage'
import { credentials } from './gcloud-credentials'
import { screenshotFilename } from './filename'

const storage = new Storage({ credentials })
const bucket = storage.bucket(process.env.STORAGE_BUCKET || 'chronogram')

export const saveImage = async (
  userID: string,
  snapshot: URLSnapshot,
  data: Buffer
): Promise<string> => {
  const filename = screenshotFilename(snapshot)
  const file = bucket.file(`${userID}/${filename}`)
  await file.save(data, {
    public: true,
    contentType: 'image/png',
    metadata: {
      'Cache-Control': 'public, s-max-age=31536000, immutable'
    }
  })

  return `https://storage.googleapis.com/${bucket.name}/${userID}/${filename}`
}
