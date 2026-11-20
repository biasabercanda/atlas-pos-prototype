/** Dollars from menu.json → integer cents. */
export function toCents(dollars: number): number {
  return Math.round(dollars * 100)
}

/** 1290 → "$12.90"; -300 → "−$3.00" (true minus sign, U+2212). */
export function formatMoney(cents: number): string {
  const sign = cents < 0 ? '−' : ''
  const abs = Math.abs(cents)
  return `${sign}$${Math.floor(abs / 100)}.${String(abs % 100).padStart(2, '0')}`
}

/** total = subtotal × (1 + rate), rounded to the nearest `roundToCents`. 4270 → 5120. */
export function applySurcharge(subtotalCents: number, rate: number, roundToCents: number): number {
  const raw = subtotalCents * (1 + rate)
  return Math.round(raw / roundToCents) * roundToCents
}
