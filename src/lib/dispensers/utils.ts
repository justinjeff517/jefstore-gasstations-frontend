export const keyOf = (r: { dispenser: string; nozzle: string }) => `${r.dispenser}::${r.nozzle}`
export const toNum = (v: any) => (Number.isFinite(Number(v)) ? Number(v) : 0)
export const currency = (v: number) =>
  `₱ ${Number.isFinite(v) ? v.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}`
