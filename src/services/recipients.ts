import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, updateDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'
import type { Recipient } from '../types'

const recipientsCol = (userId: string) => collection(db, 'users', userId, 'recipients')

function nowMs(): number {
  return Date.now()
}

export async function listRecipients(): Promise<Recipient[]> {
  const user = auth.currentUser
  if (!user) return []
  const q = query(recipientsCol(user.uid), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Recipient[]
}

export async function getRecipient(id: string): Promise<Recipient | null> {
  const user = auth.currentUser
  if (!user) return null
  const ref = doc(db, 'users', user.uid, 'recipients', id)
  const snap = await getDoc(ref)
  if (!snap.exists()) return null
  return { id: snap.id, ...(snap.data() as any) } as Recipient
}

export async function createRecipient(input: Omit<Recipient, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>): Promise<string> {
  const user = auth.currentUser
  if (!user) throw new Error('Not signed in')
  const data = {
    ...input,
    createdBy: user.isAnonymous ? 'anon' : 'user',
    createdAt: nowMs(),
    updatedAt: nowMs(),
  }
  const res = await addDoc(recipientsCol(user.uid), data as any)
  return res.id
}

export async function updateRecipient(id: string, update: Partial<Recipient>): Promise<void> {
  const user = auth.currentUser
  if (!user) throw new Error('Not signed in')
  const ref = doc(db, 'users', user.uid, 'recipients', id)
  await updateDoc(ref, { ...update, updatedAt: nowMs() } as any)
}

export async function deleteRecipient(id: string): Promise<void> {
  const user = auth.currentUser
  if (!user) throw new Error('Not signed in')
  const ref = doc(db, 'users', user.uid, 'recipients', id)
  await deleteDoc(ref)
}

