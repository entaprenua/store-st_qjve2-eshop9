const GUEST_CART_KEY = 'guest_cart_id'

export function getGuestId(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(GUEST_CART_KEY)
}

export function setGuestId(id: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(GUEST_CART_KEY, id)
}

export function generateGuestId(): string {
  const id = crypto.randomUUID()
  setGuestId(id)
  return id
}

export function getOrCreateGuestId(): string {
  const existing = getGuestId()
  if (existing) return existing
  return generateGuestId()
}

export function clearGuestId(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(GUEST_CART_KEY)
}
