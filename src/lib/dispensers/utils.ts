export function keyOf(r: { dispenser: string; nozzle: string }) {
  return `${r.dispenser}:${r.nozzle}`
}

export function toNum(v: unknown, fallback = 0) {
  if (typeof v === 'number') return Number.isFinite(v) ? v : fallback
  if (typeof v === 'string') {
    const n = Number(v.replace(/,/g, '').trim())
    return Number.isFinite(n) ? n : fallback
  }
  return fallback
}

export function currency(value: number, locale = 'en-PH', currency = 'PHP') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(value)
}
