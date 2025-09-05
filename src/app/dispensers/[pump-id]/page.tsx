'use client'

import { useMemo, useState } from 'react'
import { notFound, useParams, useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { RowCard } from '@/components/dispensers/RowCard'
import type { DispenserSpec, Row, UpdateRecord } from '@/lib/dispensers/types'
import { keyOf, toNum } from '@/lib/dispensers/utils'

const today = new Date().toISOString().slice(0, 10)

const DISPENSERS: DispenserSpec[] = [
  { dispenser_id: 'dispenser_1', location: 'East', nozzles: [{ id: 'nozzle_1', product: 'Diesel' }, { id: 'nozzle_2', product: 'Regular' }] },
  { dispenser_id: 'dispenser_2', location: 'West',  nozzles: [{ id: 'nozzle_1', product: 'Diesel' }, { id: 'nozzle_2', product: 'Regular' }] },
]

const baseAnalogByKey: Record<string, number> = Object.fromEntries(
  DISPENSERS.flatMap(d => d.nozzles.map(n => [keyOf({ dispenser: d.dispenser_id, nozzle: n.id }), 0] as const))
)

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
      product_label: `${dispenser.toUpperCase().replace('_', ' ')} — ${n.product}`,
      unit: 'L',
      submitted: true,
    }
  })
)

export default function PumpEditPage() {
  const router = useRouter()
  const params = useParams() as { ['pump-id']?: string }
  const pumpParam = params['pump-id']
  const pumpNumber = useMemo(() => Number(pumpParam), [pumpParam])

  const [rows, setRows] = useState<Row[]>(() => {
    try {
      const raw = typeof window !== 'undefined' ? sessionStorage.getItem('dispensers_rows') : null
      if (raw) return JSON.parse(raw) as Row[]
    } catch {}
    return initialRows
  })

  if (!Number.isInteger(pumpNumber) || pumpNumber < 1 || pumpNumber > rows.length) {
    notFound()
  }

  const idx = pumpNumber - 1
  const row = rows[idx]
  const baseAnalog = row ? (baseAnalogByKey[keyOf(row)] ?? 0) : 0

  const handleSaveEdit = (patch: Partial<UpdateRecord>) => {
    if (!row) return
    const rowKey = keyOf(row)
    const updated = rows.map((r, i) => {
      if (i !== idx) return r
      const date = (patch.date as string) ?? r.date
      const beginning_register = toNum(patch.beginning_register ?? r.beginning_register)
      const calibration = toNum(patch.calibration ?? r.calibration)
      const price = Math.max(0, toNum(patch.price ?? r.price))
      const po = Math.max(0, toNum(patch.po ?? r.po))
      const cash = Math.max(0, toNum(patch.cash ?? r.cash))
      const delta = calibration + po + cash
      const ending_register = beginning_register + delta
      const analog_register = (baseAnalogByKey[rowKey] ?? 0) + delta
      return {
        ...r,
        date,
        beginning_register,
        ending_register,
        analog_register,
        calibration,
        price,
        po,
        cash,
        submitted: true,
      }
    })
    setRows(updated)
    try { sessionStorage.setItem('dispensers_rows', JSON.stringify(updated)) } catch {}
    router.replace('/dispensers')
  }

  const onBack = () => {
    router.replace('/dispensers')
  }

  return (
    <div className="min-h-[100dvh]">
      <div className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-md h-12 px-2 flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1 rounded-lg border px-2.5 h-9 text-sm hover:bg-neutral-50 active:bg-neutral-100"
            aria-label="Back to dispensers"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>
          <div className="text-right leading-tight">
            <div className="text-[11px] uppercase tracking-wide text-neutral-500">Pump</div>
            <div className="text-base font-semibold">#{pumpNumber}</div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-md p-4 pb-24 space-y-3">
        <div className="rounded-xl border border-neutral-200 shadow-sm p-4 sm:p-5 space-y-2">
          <div className="flex items-baseline justify-between">
            <h1 className="text-sm font-semibold">Edit Readings</h1>
            <span className="text-xs text-neutral-500 truncate max-w-[60%] text-right">{row?.product_label}</span>
          </div>
          <RowCard
            row={row}
            isEditing={true}
            baseAnalog={baseAnalog}
            onStartEdit={() => {}}
            onCancelEdit={onBack}
            onSaveEdit={handleSaveEdit}
          />
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-md px-4 py-3 pb-[env(safe-area-inset-bottom)]">
          <button
            onClick={onBack}
            className="w-full rounded-lg border px-3 py-2.5 text-sm font-medium hover:bg-neutral-50 active:bg-neutral-100"
          >
            Back to Dispensers
          </button>
        </div>
      </div>
    </div>
  )
}
