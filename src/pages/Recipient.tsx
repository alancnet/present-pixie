import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { auth, db } from '../firebase'
import { collection, doc, getDoc } from 'firebase/firestore'
import { Button, Card, CardBody } from '@heroui/react'
import { httpsCallable } from 'firebase/functions'
import { getFunctions } from 'firebase/functions'

type Recipient = {
  id?: string
  name: string
  occasion?: string
  occasionDate?: string
  interests?: string[]
  budgetMin?: number
  budgetMax?: number
}

type Product = {
  asin: string
  title: string
  image?: string
  price?: string
  url?: string
}

export default function RecipientPage() {
  const { id } = useParams()
  const [recipient, setRecipient] = useState<Recipient | null>(null)
  const [items, setItems] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const uid = auth.currentUser?.uid
    if (!uid || !id) return
    const ref = doc(collection(db, 'users', uid, 'recipients'), id)
    getDoc(ref).then((snap) => {
      if (snap.exists()) setRecipient({ id: snap.id, ...(snap.data() as any) })
    })
  }, [id])

  const fetchItems = async () => {
    if (!recipient) return
    setLoading(true)
    try {
      const fn = httpsCallable(getFunctions(), 'amazonSearch')
      const res: any = await fn({ recipient })
      setItems(res.data?.items ?? [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipient?.id])

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{recipient?.name}</h1>
          <div className="text-default-500 text-sm">{recipient?.occasion}{recipient?.occasionDate ? ` • ${recipient.occasionDate}` : ''}</div>
        </div>
        <Button onPress={fetchItems} isLoading={loading}>Refresh</Button>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((p) => (
          <Card key={p.asin}>
            <CardBody className="space-y-2">
              {p.image && <img src={p.image} alt={p.title} className="w-full h-40 object-cover rounded" />}
              <div className="font-medium text-sm line-clamp-2">{p.title}</div>
              <div className="text-default-500 text-sm">{p.price ?? ''}</div>
              {p.url && <Button as={"a" as any} href={p.url} target="_blank" rel="noopener" color="primary">View on Amazon</Button>}
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  )
}

