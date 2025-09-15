// Mock Amazon search + affiliate link util for MVP without Cloud Functions
// In production, this should call a secured Cloud Function that talks to PA-API v5

export interface AmazonProduct {
  asin: string
  title: string
  image: string
  price?: string
  url: string
}

const MOCK_ITEMS: AmazonProduct[] = [
  {
    asin: 'B00EXAMPLE1',
    title: 'Cozy Throw Blanket',
    image: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=640&q=80&auto=format&fit=crop',
    url: 'https://www.amazon.com/dp/B00EXAMPLE1',
  },
  {
    asin: 'B00EXAMPLE2',
    title: 'Bluetooth Headphones',
    image: 'https://images.unsplash.com/photo-1518443881112-17e0b7fbd0a6?w=640&q=80&auto=format&fit=crop',
    url: 'https://www.amazon.com/dp/B00EXAMPLE2',
  },
  {
    asin: 'B00EXAMPLE3',
    title: 'Artisanal Coffee Sampler',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=640&q=80&auto=format&fit=crop',
    url: 'https://www.amazon.com/dp/B00EXAMPLE3',
  },
]

export function withAffiliate(url: string, tag?: string): string {
  const u = new URL(url)
  if (tag) u.searchParams.set('tag', tag)
  return u.toString()
}

export interface SearchParams {
  interests?: string[]
  budgetMin?: number
  budgetMax?: number
  affiliateTag?: string
}

export async function searchAmazon(params: SearchParams): Promise<AmazonProduct[]> {
  // For now, return mock items with affiliate tag applied
  const { affiliateTag } = params
  return MOCK_ITEMS.map((p) => ({ ...p, url: withAffiliate(p.url, affiliateTag) }))
}

