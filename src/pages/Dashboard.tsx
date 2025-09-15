import { Button, Card, CardBody, CardHeader, Input, Select, SelectItem, Textarea } from '@heroui/react'
import { useEffect, useMemo, useState } from 'react'
import { auth } from '../firebase'
import { signOut } from 'firebase/auth'
import type { Recipient } from '../types'
import { createRecipient, deleteRecipient, listRecipients } from '../services/recipients'
import { searchAmazon } from '../services/amazon'
import { AMAZON_ASSOCIATE_TAG } from '../config'
import { logSignal } from '../services/signals'

type NewRecipientState = {
  name: string
  occasion: Recipient['occasion']
  occasionDate?: string
  budgetMin?: string
  budgetMax?: string
  interestsText: string
  constraints?: string
}

export default function Dashboard() {
  const [recipients, setRecipients] = useState<Recipient[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRecipientId, setSelectedRecipientId] = useState<string | null>(null)
  const [form, setForm] = useState<NewRecipientState>({
    name: '',
    occasion: 'birthday',
    occasionDate: '',
    budgetMin: '',
    budgetMax: '',
    interestsText: '',
    constraints: '',
  })
  const [products, setProducts] = useState<{ asin: string; title: string; image: string; url: string }[]>([])
  const selectedRecipient = useMemo(() => recipients.find((r) => r.id === selectedRecipientId) ?? null, [recipients, selectedRecipientId])

  useEffect(() => {
    let active = true
    ;(async () => {
      setLoading(true)
      const items = await listRecipients()
      if (!active) return
      setRecipients(items)
      setLoading(false)
      if (items.length && !selectedRecipientId) setSelectedRecipientId(items[0].id)
    })()
    return () => {
      active = false
    }
  }, [])

  async function handleCreateRecipient() {
    const payload: Omit<Recipient, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'> = {
      name: form.name.trim(),
      occasion: form.occasion,
      occasionDate: form.occasionDate || undefined,
      dob: undefined,
      ageBucket: undefined,
      budgetMin: form.budgetMin ? Number(form.budgetMin) : undefined,
      budgetMax: form.budgetMax ? Number(form.budgetMax) : undefined,
      interests: form.interestsText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      owns: [],
      constraints: form.constraints || undefined,
      demographics: undefined,
    }
    const id = await createRecipient(payload)
    const items = await listRecipients()
    setRecipients(items)
    setSelectedRecipientId(id)
    setForm({ name: '', occasion: 'birthday', occasionDate: '', budgetMin: '', budgetMax: '', interestsText: '', constraints: '' })
  }

  async function handleDeleteRecipient(id: string) {
    await deleteRecipient(id)
    const items = await listRecipients()
    setRecipients(items)
    if (selectedRecipientId === id) setSelectedRecipientId(items[0]?.id ?? null)
  }

  async function handleSearchGifts() {
    if (!selectedRecipient) return
    const res = await searchAmazon({
      interests: selectedRecipient.interests,
      budgetMin: selectedRecipient.budgetMin,
      budgetMax: selectedRecipient.budgetMax,
      affiliateTag: AMAZON_ASSOCIATE_TAG,
    })
    setProducts(res)
  }

  function openProduct(p: { asin: string; url: string }) {
    void logSignal({ asin: p.asin, action: 'click', recipientId: selectedRecipientId ?? undefined })
    window.open(p.url, '_blank', 'noopener,noreferrer')
  }

  function thumbs(asin: string, up: boolean) {
    void logSignal({ asin, action: up ? 'thumbs_up' : 'thumbs_down', recipientId: selectedRecipientId ?? undefined })
  }

  function addToCart(p: { asin: string; url: string }) {
    void logSignal({ asin: p.asin, action: 'add_to_cart', recipientId: selectedRecipientId ?? undefined })
    window.open(p.url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Present Pixie</h1>
        <Button color="danger" onPress={() => signOut(auth)}>Sign out</Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <div className="font-semibold">Create Recipient</div>
          </CardHeader>
          <CardBody className="space-y-3">
            <Input label="Name" value={form.name} onValueChange={(v) => setForm((s) => ({ ...s, name: v }))} />
            <Select
              label="Occasion"
              selectedKeys={[form.occasion]}
              onSelectionChange={(keys) => setForm((s) => ({ ...s, occasion: Array.from(keys)[0] as Recipient['occasion'] }))}
            >
              <SelectItem key="birthday">Birthday</SelectItem>
              <SelectItem key="anniversary">Anniversary</SelectItem>
              <SelectItem key="holiday">Holiday</SelectItem>
              <SelectItem key="other">Other</SelectItem>
            </Select>
            <Input type="date" label="Occasion Date" value={form.occasionDate}
              onValueChange={(v) => setForm((s) => ({ ...s, occasionDate: v }))}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input type="number" label="Budget Min" value={form.budgetMin} onValueChange={(v) => setForm((s) => ({ ...s, budgetMin: v }))} />
              <Input type="number" label="Budget Max" value={form.budgetMax} onValueChange={(v) => setForm((s) => ({ ...s, budgetMax: v }))} />
            </div>
            <Textarea label="Interests (comma-separated)" value={form.interestsText} onValueChange={(v) => setForm((s) => ({ ...s, interestsText: v }))} minRows={2} />
            <Input label="Constraints" value={form.constraints} onValueChange={(v) => setForm((s) => ({ ...s, constraints: v }))} />
            <Button color="primary" onPress={handleCreateRecipient} isDisabled={!form.name.trim()}>Save Recipient</Button>
          </CardBody>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between w-full">
              <div className="font-semibold">Your Recipients</div>
              <Button size="sm" variant="bordered" onPress={handleSearchGifts} isDisabled={!selectedRecipientId}>Refresh Gifts</Button>
            </div>
          </CardHeader>
          <CardBody>
            {loading ? (
              <div className="text-default-500">Loading...</div>
            ) : (
              <div className="space-y-3">
                {recipients.length === 0 && <div className="text-default-500">No recipients yet. Create one to get started.</div>}
                {recipients.map((r) => (
                  <div key={r.id} className={`flex items-center justify-between p-3 rounded-medium border ${selectedRecipientId === r.id ? 'border-primary' : 'border-default-200'}`}>
                    <div className="flex-1">
                      <div className="font-medium">{r.name}</div>
                      <div className="text-xs text-default-500">{r.occasion}{r.occasionDate ? ` • ${r.occasionDate}` : ''}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant={selectedRecipientId === r.id ? 'solid' : 'bordered'} onPress={() => setSelectedRecipientId(r.id)}>Select</Button>
                      <Button size="sm" color="danger" variant="light" onPress={() => void handleDeleteRecipient(r.id)}>Delete</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="font-semibold">Gift Ideas {selectedRecipient ? `for ${selectedRecipient.name}` : ''}</div>
        </CardHeader>
        <CardBody>
          {products.length === 0 ? (
            <div className="text-default-500">Click "Refresh Gifts" to fetch suggestions.</div>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {products.map((p) => (
                <div key={p.asin} className="rounded-medium border border-default-200 overflow-hidden">
                  <img src={p.image} alt={p.title} className="w-full h-40 object-cover" />
                  <div className="p-3 space-y-2">
                    <div className="text-sm font-medium line-clamp-2 min-h-10">{p.title}</div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="bordered" onPress={() => thumbs(p.asin, true)}>👍</Button>
                      <Button size="sm" variant="bordered" onPress={() => thumbs(p.asin, false)}>👎</Button>
                      <Button size="sm" color="primary" onPress={() => addToCart(p)}>Add to Cart</Button>
                    </div>
                    <Button size="sm" variant="light" onPress={() => openProduct(p)}>View on Amazon</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  )
}
