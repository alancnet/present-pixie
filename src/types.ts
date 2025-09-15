// Firestore domain types

export type OccasionType = 'birthday' | 'anniversary' | 'holiday' | 'other'

export interface Recipient {
  id: string
  name: string
  occasion: OccasionType
  occasionDate?: string // ISO date
  dob?: string // ISO date
  ageBucket?: string // e.g., "25-34"
  budgetMin?: number
  budgetMax?: number
  interests: string[]
  owns?: string[] // ASINs or keywords
  constraints?: string
  demographics?: {
    gender?: string
    orientation?: string
  }
  createdBy: 'anon' | 'user'
  createdAt: number
  updatedAt: number
}

export interface GiftEvent {
  id: string
  recipientId: string
  asin: string
  status: 'saved' | 'purchased'
  price?: number
  clickedAt?: number
  purchasedAt?: number
}

export interface RecommendationItem {
  asin: string
  score: number
  reasons?: string[]
}

export interface RecommendationDoc {
  recipientId: string
  items: RecommendationItem[]
}

export type SignalAction =
  | 'view'
  | 'impress'
  | 'click'
  | 'thumbs_up'
  | 'thumbs_down'
  | 'add_to_cart'
  | 'purchase'

export interface SignalEvent {
  userId?: string
  recipientId?: string
  asin: string
  action: SignalAction
  ts: number
}

