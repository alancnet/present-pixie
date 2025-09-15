import { addDoc, collection } from 'firebase/firestore'
import { auth, db } from '../firebase'
import type { SignalEvent } from '../types'

const signalsCol = () => collection(db, 'signals', yyyyMmDd(), 'events')

function yyyyMmDd(): string {
  const d = new Date()
  const y = d.getUTCFullYear()
  const m = String(d.getUTCMonth() + 1).padStart(2, '0')
  const day = String(d.getUTCDate()).padStart(2, '0')
  return `${y}${m}${day}`
}

export async function logSignal(partial: Omit<SignalEvent, 'ts' | 'userId'>): Promise<void> {
  const user = auth.currentUser
  const evt: SignalEvent = {
    ...partial,
    userId: user?.uid,
    ts: Date.now(),
  }
  // Best-effort; ignore errors to avoid blocking UI
  try {
    await addDoc(signalsCol(), evt as any)
  } catch {
    // noop
  }
}

