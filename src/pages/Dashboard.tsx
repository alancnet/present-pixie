import { Button, Card, CardBody, Input, Textarea, Slider } from '@heroui/react'
import { auth, db } from '../firebase'
import { signOut } from 'firebase/auth'
import { collection, addDoc, serverTimestamp, query, where, orderBy, onSnapshot } from 'firebase/firestore'
import { useEffect, useMemo, useState } from 'react'

type Recipient = {
  id?: string
  name: string
  occasion: 'birthday' | 'anniversary' | 'holiday' | 'other'
  occasionDate?: string
  age?: number
  budgetMin?: number
  budgetMax?: number
  interests: string[]
  createdAt?: any
}

export default function Dashboard() {
  const [recipients, setRecipients] = useState<Recipient[]>([])
  const [form, setForm] = useState<Recipient>({ name: '', occasion: 'birthday', interests: [], budgetMin: 20, budgetMax: 100 })
  const [interestInput, setInterestInput] = useState('')

  useEffect(() => {
    const uid = auth.currentUser?.uid
    if (!uid) return
    const col = collection(db, 'users', uid, 'recipients')
    const q = query(col, orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(q, (snap) => {
      setRecipients(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })))
    })
    return () => unsub()
  }, [])

  const addRecipient = async () => {
    const uid = auth.currentUser?.uid
    if (!uid) return
    const col = collection(db, 'users', uid, 'recipients')
    await addDoc(col, { ...form, createdAt: serverTimestamp() })
    setForm({ name: '', occasion: 'birthday', interests: [], budgetMin: 20, budgetMax: 100 })
    setInterestInput('')
  }

  const canSave = useMemo(() => form.name.trim().length > 0, [form.name])

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Recipients</h1>
        <Button color="danger" onPress={() => signOut(auth)}>Sign out</Button>
      </div>

      <Card>
        <CardBody className="grid md:grid-cols-2 gap-4">
          <Input label="Name" value={form.name} onValueChange={(v) => setForm((f) => ({ ...f, name: v }))} required />
          <Input label="Occasion" value={form.occasion} onValueChange={(v) => setForm((f) => ({ ...f, occasion: v as any }))} />
          <Input type="date" label="Occasion Date" value={form.occasionDate ?? ''} onValueChange={(v) => setForm((f) => ({ ...f, occasionDate: v || undefined }))} />
          <Input type="number" label="Age" value={String(form.age ?? '')} onValueChange={(v) => setForm((f) => ({ ...f, age: v ? Number(v) : undefined }))} />
          <div className="col-span-full grid grid-cols-2 gap-3">
            <Input type="number" label="Min Budget" value={String(form.budgetMin ?? '')} onValueChange={(v) => setForm((f) => ({ ...f, budgetMin: v ? Number(v) : undefined }))} />
            <Input type="number" label="Max Budget" value={String(form.budgetMax ?? '')} onValueChange={(v) => setForm((f) => ({ ...f, budgetMax: v ? Number(v) : undefined }))} />
          </div>
          <div className="col-span-full">
            <Input label="Add interest" value={interestInput} onValueChange={setInterestInput} onKeyDown={(e) => {
              if (e.key === 'Enter' && interestInput.trim()) {
                setForm((f) => ({ ...f, interests: Array.from(new Set([...(f.interests || []), interestInput.trim()])) }))
                setInterestInput('')
              }
            }} />
            <div className="flex flex-wrap gap-2 mt-2">
              {(form.interests || []).map((tag) => (
                <span key={tag} className="px-2 py-1 rounded bg-default-100 text-xs">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="col-span-full flex justify-end">
            <Button color="primary" isDisabled={!canSave} onPress={addRecipient}>Save Recipient</Button>
          </div>
        </CardBody>
      </Card>

      <div className="space-y-3">
        {recipients.map((r) => (
          <Card key={r.id}>
            <CardBody className="flex items-center justify-between gap-4">
              <div>
                <div className="font-medium">{r.name}</div>
                <div className="text-sm text-default-500">{r.occasion}{r.occasionDate ? ` • ${r.occasionDate}` : ''}</div>
                {r.interests?.length ? (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {r.interests.map((i) => (
                      <span key={i} className="px-2 py-1 rounded bg-default-100 text-xs">{i}</span>
                    ))}
                  </div>
                ) : null}
              </div>
              <Button as={Link as any} to={`/recipients/${r.id}`}>Open</Button>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  )
}
