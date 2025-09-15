import * as admin from 'firebase-admin'
import { onCall, HttpsError } from 'firebase-functions/v2/https'
import { onSchedule } from 'firebase-functions/v2/scheduler'
import { logger } from 'firebase-functions'

admin.initializeApp()
const db = admin.firestore()

// 1) AmazonSearchFunction (placeholder - expects to call PA-API via env)
export const amazonSearch = onCall({ region: 'us-central1' }, async (request) => {
  const uid = request.auth?.uid
  if (!uid) throw new HttpsError('unauthenticated', 'Auth required')

  const { recipient, pageToken } = request.data ?? {}
  if (!recipient) throw new HttpsError('invalid-argument', 'recipient required')

  // TODO: Map interests -> keywords/categories; call PA-API v5 using env keys
  // For now, return a mock payload
  logger.info('amazonSearch called', { uid, recipient })
  return {
    items: [],
    nextPageToken: null,
    debug: true,
  }
})

// 2) SignalIngestFunction
export const ingestSignal = onCall({ region: 'us-central1' }, async (request) => {
  const uid = request.auth?.uid
  const signal = request.data?.signal
  if (!uid) throw new HttpsError('unauthenticated', 'Auth required')
  if (!signal || !signal.asin || !signal.action) {
    throw new HttpsError('invalid-argument', 'asin and action required')
  }

  const dateId = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const docRef = db.collection('signals').doc(dateId).collection('events').doc()
  await docRef.set({ ...signal, userId: uid, ts: admin.firestore.FieldValue.serverTimestamp() })

  logger.info('signal ingested', { uid, signal })
  return { ok: true }
})

// 3) RecommenderJob (scheduled)
export const recommenderJob = onSchedule({ schedule: 'every 24 hours', region: 'us-central1' }, async () => {
  logger.info('recommender job start')
  // TODO: Build graph from signals and write recommendations
  logger.info('recommender job end')
})

// 4) OccasionReminderJob (daily)
export const occasionReminderJob = onSchedule({ schedule: 'every day 09:00', timeZone: 'UTC', region: 'us-central1' }, async () => {
  logger.info('occasion reminder job start')
  // TODO: Scan recipients with upcoming dates and enqueue FCM
  logger.info('occasion reminder job end')
})

// 5) AccountLinkMerge (placeholder - would be an auth trigger in v2 identity)
// Implement as needed when linking anonymous to permanent accounts.

