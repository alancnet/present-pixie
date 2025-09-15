import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, updateDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'
import type { GiftEvent } from '../types'

const eventsCol = (userId: string) => collection(db, 'users', userId, 'events')

function nowMs(): number {
  return Date.now()
}

export async function listEvents(): Promise<GiftEvent[]> {
  const user = auth.currentUser
  if (!user) return []
  const q = query(eventsCol(user.uid), orderBy('clickedAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as GiftEvent[]
}

export async function createEvent(input: Omit<GiftEvent, 'id'>): Promise<string> {
  const user = auth.currentUser
  if (!user) throw new Error('Not signed in')
  const res = await addDoc(eventsCol(user.uid), { ...input })
  return res.id
}

export async function updateEvent(id: string, update: Partial<GiftEvent>): Promise<void> {
  const user = auth.currentUser
  if (!user) throw new Error('Not signed in')
  const ref = doc(db, 'users', user.uid, 'events', id)
  await updateDoc(ref, { ...update, updatedAt: nowMs() } as any)
}

export async function deleteEvent(id: string): Promise<void> {
  const user = auth.currentUser
  if (!user) throw new Error('Not signed in')
  const ref = doc(db, 'users', user.uid, 'events', id)
  await deleteDoc(ref)
}

