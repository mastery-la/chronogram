import { Firestore } from '@google-cloud/firestore'
import { credentials } from './gcloud-credentials'

export const firestore = new Firestore({
    projectId: 'chronogram',
    credentials
})
