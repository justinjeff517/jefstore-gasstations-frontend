'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Pencil } from 'lucide-react'

// ---------------- Dispensers (source of rows) ----------------
type NozzleSpec = { id: 'nozzle_1' | 'nozzle_2'; product: 'Diesel' | 'Regular' }
type DispenserSpec = { dispenser_id: 'dispenser_1' | 'dispenser_2'; location: 'East' | 'West'; nozzles: NozzleSpec[] }

const DISPENSERS: DispenserSpec[] = [
  {
    dispenser_id: 'dispenser_1',
    location: 'East',
    nozzles: [
      { id: 'nozzle_1', product: 'Diesel' },
      { id: 'nozzle_2', product: 'Regular' },
    ],
  },
  {
    dispenser_id: 'dispenser_2',
    location: 'West',
    nozzles: [
      { id: 'nozzle_1', product: 'Diesel' },
      { id: 'nozzle_2', product: 'Regular' },
    ],
  },
]

// ---------------- Schema (order locked) ----------------
type UpdateRecord = {
  dispenser: string
  nozzle: string
  date: string
  beginning_register: number
  ending_register: number
  analog_register: number
  calibration: number
  price: number
  po: number
  cash: number
}

// UI row extends ordered schema with extras for display
type Row = UpdateRecord & {
  product_label: string   // e.g., "DISPENSER_1 — Diesel"
  unit: 'L'
  submitted: boolean
}

// ---------------- Helpers ----------------
const today = new Date().toISOString().slice(0, 10)
const keyOf = (r: { dispenser: string; nozzle: string }) => `${r.dispenser}::${r.nozzle}`
const toNum = (v: any) => (Number.isFinite(Number(v)) ? Number(v) : 0)
const currency = (v: number) =>
  `₱ ${Number.isFinite(v) ? v.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}`

// Base analog per nozzle (hydrate from “yesterday” in real use)
const baseAnalogByKey: Record<string, number> = Object.fromEntries(
  DISPENSERS.flatMap(d => d.nozzles.map(n => [keyOf({ dispenser: d.dispenser_id, nozzle: n.id }), 0] as const))
)

// ---------------- Initial rows (schema order preserved) ----------------
const initialRows: Row[] = DISPENSERS.flatMap(d =>
  d.nozzles.map(n => {
    const dispenser = d.dispenser_id
    const nozzle = n.id
    const date = today
    const beginning_register = 0
    const calibration = 0
    const po = 0
    const cash = 0
    const price = n.product === 'Diesel' ? 68.5 : 65.0
    const delta = calibration + po + cash
    const ending_register = beginning_register + delta
    const analog_register = (baseAnalogByKey[keyOf({ dispenser, nozzle })] ?? 0) + delta

    return {
      // ---- schema fields in exact order ----
      dispenser,
      nozzle,
      date,
      beginning_register,
      ending_register,
      analog_register,
      calibration,
      price,
      po,
      cash,
      // ---- ui helpers ----
      product_label: `${dispenser.toUpperCase().replace('_', ' ')} — ${n.product}`,
      unit: 'L',
      submitted: true,
    }
  })
)

// ---------------- Component ----------------
export default function Page() {
  const [rows, setRows] = useState<Row[]>(initialRows)
  const [editingKey, setEditingKey] = useState<string | null>(null)
  const [draft, setDraft] = useState<Partial<UpdateRecord>>({})
  const [draftBaseAnalog, setDraftBaseAnalog] = useState<number>(0)

  const startEdit = (r: Row) => {
    setEditingKey(keyOf(r))
    setDraft({
      dispenser: r.dispenser,
      nozzle: r.nozzle,
      date: r.date,
      beginning_register: r.beginning_register,
      ending_register: r.ending_register,      // kept for completeness, recalculated on save
      analog_register: r.analog_register,      // kept for completeness, recalculated on save
      calibration: r.calibration,
      price: r.price,
      po: r.po,
      cash: r.cash,
    })
    setDraftBaseAnalog(baseAnalogByKey[keyOf(r)] ?? 0)
  }

  const cancelEdit = () => {
    setEditingKey(null)
    setDraft({})
  }

  const saveEdit = () => {
    if (!editingKey) return
    setRows(prev =>
      prev.map(r => {
        if (keyOf(r) !== editingKey) return r

        // —— read in schema order ——
        const dispenser = r.dispenser // fixed identity
        const nozzle = r.nozzle       // fixed identity
        const date = (draft.date as string) || r.date

        const beginning_register = toNum(draft.beginning_register ?? r.beginning_register)
        const calibration = toNum(draft.calibration ?? r.calibration)
        const price = Math.max(0, toNum(draft.price ?? r.price))
        const po = Math.max(0, toNum(draft.po ?? r.po))
        const cash = Math.max(0, toNum(draft.cash ?? r.cash))

        // Intended rules:
        // ending_register = beginning_register + calibration + po + cash
        // analog_register = baseAnalog(yesterday) + calibration + po + cash
        const delta = calibration + po + cash
        const ending_register = beginning_register + delta
        const analog_register = draftBaseAnalog + delta

        return {
          // —— write back in schema order ——
          dispenser,
          nozzle,
          date,
          beginning_register,
          ending_register,
          analog_register,
          calibration,
          price,
          po,
          cash,
          // —— ui helpers ——
          product_label: r.product_label,
          unit: r.unit,
          submitted: true,
        }
      })
    )
    setEditingKey(null)
    setDraft({})
  }

  const NAV_HEIGHT = 64

  return (
    <div className="p-4 space-y-3 overflow-y-auto" style={{ paddingBottom: NAV_HEIGHT }}>
      {rows.map(r => {
        const isEditing = editingKey === keyOf(r)
        const borderColor = isEditing ? 'border-red-500' : r.submitted ? 'border-green-500' : 'border-red-500'
        const sold = r.po + r.cash

        return (
          <div key={keyOf(r)} className={`rounded-xl border p-4 shadow-sm flex flex-col gap-3 ${borderColor}`}>
            <div className="font-medium text-base break-words">
              {r.product_label} <span className="opacity-60 text-xs">({r.dispenser} · {r.nozzle})</span>
            </div>

            {/* --- Summary: min 3 / max 4 per row --- */}
            {!isEditing && (
              <>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-2 text-sm">
                  {[
                    { label: 'Beginning', qty: r.beginning_register },
                    { label: 'Sold (PO+Cash)', qty: sold },
                    { label: 'Ending', qty: r.ending_register },
                  ].map(({ label, qty }) => (
                    <div key={label} className="rounded-lg bg-muted p-2 text-center flex flex-col justify-center">
                      <div className="font-semibold">{qty.toLocaleString()} {r.unit}</div>
                      <div className="text-xs opacity-70">{currency(qty * r.price)}</div>
                      <div className="text-[10px] opacity-60">{label}</div>
                    </div>
                  ))}
                </div>

                {/* --- Details: strictly in schema order; min 3 / max 4 per row --- */}
                <div className="grid grid-cols-3 md:grid-cols-4 gap-2 text-xs">
                  <div className="rounded-lg bg-muted p-2 text-center">
                    <div className="font-semibold">{r.dispenser}</div>
                    <div className="opacity-70">dispenser</div>
                  </div>
                  <div className="rounded-lg bg-muted p-2 text-center">
                    <div className="font-semibold">{r.nozzle}</div>
                    <div className="opacity-70">nozzle</div>
                  </div>
                  <div className="rounded-lg bg-muted p-2 text-center">
                    <div className="font-semibold">{r.date}</div>
                    <div className="opacity-70">date</div>
                  </div>
                  <div className="rounded-lg bg-muted p-2 text-center">
                    <div className="font-semibold">{r.beginning_register}</div>
                    <div className="opacity-70">beginning_register</div>
                  </div>
                  <div className="rounded-lg bg-muted p-2 text-center">
                    <div className="font-semibold">{r.ending_register}</div>
                    <div className="opacity-70">ending_register</div>
                  </div>
                  <div className="rounded-lg bg-muted p-2 text-center">
                    <div className="font-semibold">{r.analog_register}</div>
                    <div className="opacity-70">analog_register</div>
                  </div>
                  <div className="rounded-lg bg-muted p-2 text-center">
                    <div className="font-semibold">{r.calibration}</div>
                    <div className="opacity-70">calibration</div>
                  </div>
                  <div className="rounded-lg bg-muted p-2 text-center">
                    <div className="font-semibold">{r.price.toFixed(2)}</div>
                    <div className="opacity-70">price</div>
                  </div>
                  <div className="rounded-lg bg-muted p-2 text-center">
                    <div className="font-semibold">{r.po}</div>
                    <div className="opacity-70">po</div>
                  </div>
                  <div className="rounded-lg bg-muted p-2 text-center">
                    <div className="font-semibold">{r.cash}</div>
                    <div className="opacity-70">cash</div>
                  </div>
                </div>

                <Button onClick={() => startEdit(r)} variant="secondary" className="w-full flex items-center gap-2">
                  <Pencil className="w-4 h-4" />
                  Change
                </Button>
              </>
            )}

            {/* --- Edit form: inputs appear in schema order; min 3 / max 4 per row --- */}
            {isEditing && (
              <>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                  {/* dispenser (read-only identity) */}
                  <div className="space-y-1">
                    <div className="text-xs opacity-70">dispenser</div>
                    <Input value={r.dispenser} disabled className="text-center" />
                  </div>

                  {/* nozzle (read-only identity) */}
                  <div className="space-y-1">
                    <div className="text-xs opacity-70">nozzle</div>
                    <Input value={r.nozzle} disabled className="text-center" />
                  </div>

                  {/* date */}
                  <div className="space-y-1">
                    <div className="text-xs opacity-70">date</div>
                    <Input
                      type="date"
                      value={(draft.date as string) ?? r.date}
                      onChange={(e) => setDraft(d => ({ ...d, date: e.target.value }))}
                      className="text-center"
                    />
                  </div>

                  {/* beginning_register */}
                  <div className="space-y-1">
                    <div className="text-xs opacity-70">beginning_register ({r.unit})</div>
                    <Input
                      type="number"
                      value={draft.beginning_register ?? r.beginning_register}
                      onChange={(e) => setDraft(d => ({ ...d, beginning_register: toNum(e.target.value) }))}
                      className="text-center"
                    />
                  </div>

                  {/* ending_register (computed; read-only in UI) */}
                  <div className="space-y-1">
                    <div className="text-xs opacity-70">ending_register ({r.unit})</div>
                    <Input value={r.ending_register} disabled className="text-center" />
                  </div>

                  {/* analog_register (computed; read-only in UI) */}
                  <div className="space-y-1">
                    <div className="text-xs opacity-70">analog_register</div>
                    <Input value={r.analog_register} disabled className="text-center" />
                  </div>

                  {/* calibration */}
                  <div className="space-y-1">
                    <div className="text-xs opacity-70">calibration ({r.unit})</div>
                    <Input
                      type="number"
                      value={draft.calibration ?? r.calibration}
                      onChange={(e) => setDraft(d => ({ ...d, calibration: toNum(e.target.value) }))}
                      className="text-center"
                    />
                  </div>

                  {/* price */}
                  <div className="space-y-1">
                    <div className="text-xs opacity-70">price (₱/L)</div>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={draft.price ?? r.price}
                      onChange={(e) => setDraft(d => ({ ...d, price: toNum(e.target.value) }))}
                      className="text-center"
                    />
                  </div>

                  {/* po */}
                  <div className="space-y-1">
                    <div className="text-xs opacity-70">po ({r.unit})</div>
                    <Input
                      type="number"
                      min="0"
                      value={draft.po ?? r.po}
                      onChange={(e) => setDraft(d => ({ ...d, po: toNum(e.target.value) }))}
                      className="text-center"
                    />
                  </div>

                  {/* cash */}
                  <div className="space-y-1">
                    <div className="text-xs opacity-70">cash ({r.unit})</div>
                    <Input
                      type="number"
                      min="0"
                      value={draft.cash ?? r.cash}
                      onChange={(e) => setDraft(d => ({ ...d, cash: toNum(e.target.value) }))}
                      className="text-center"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={saveEdit} className="flex-1">Save</Button>
                  <Button onClick={cancelEdit} variant="secondary" className="flex-1">Cancel</Button>
                </div>
              </>
            )}
          </div>
        )
      })}
    </div>
  )
}
