'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { RowCard } from '@/components/dispensers/RowCard'
import { Keycap } from '@/components/Keycap'
import type { DispenserSpec, Row, UpdateRecord } from '@/lib/dispensers/types'
import { keyOf } from '@/lib/dispensers/utils'

const today = new Date().toISOString().slice(0, 10)

const DISPENSERS: DispenserSpec[] = [
  {
    dispenser_id: 'dispenser_east',
    location: 'East',
    nozzles: [
      { id: 'regular', product: 'Regular' },
      { id: 'diesel', product: 'Diesel' },
    ],
  },
  {
    dispenser_id: 'dispenser_west',
    location: 'West',
    nozzles: [
      { id: 'regular', product: 'Regular' },
      { id: 'diesel', product: 'Diesel' },
    ],
  },
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
      product_label: `${d.location} — ${n.product}`,
      unit: 'L',
      submitted: true,
    }
  })
)

export default function Page() {
  const router = useRouter()
  const [rows] = useState<Row[]>(initialRows)
  const [chooserOpen, setChooserOpen] = useState(false)
  const [loadingPump, setLoadingPump] = useState<number | null>(null)
  const NAV_HEIGHT = 64

  const gotoPump = (pumpNumber: number) => {
    if (pumpNumber < 1 || pumpNumber > 4) return
    setLoadingPump(pumpNumber)
    router.push(`/dispensers/${pumpNumber}`)
  }

  useEffect(() => {
    const isTyping = (el: EventTarget | null) => {
      if (!(el instanceof HTMLElement)) return false
      const tag = el.tagName
      const editable = el.getAttribute('contenteditable')
      return tag === 'INPUT' || tag === 'TEXTAREA' || editable === '' || editable === 'true'
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.repeat) return
      if (isTyping(e.target)) return

      if (e.key === '9' || e.key === '0') {
        e.preventDefault()
        setChooserOpen(true)
        return
      }

      if (chooserOpen) {
        if (['1', '2', '3', '4'].includes(e.key)) {
          e.preventDefault()
          gotoPump(Number(e.key))
          return
        }
        if (e.key === 'Escape' || e.key === '0') {
          e.preventDefault()
          setChooserOpen(false)
          return
        }
      }
    }

    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [chooserOpen])

  const CHOICES = [
    { k: '1', label: 'East Regular', pump: 1 },
    { k: '2', label: 'East Diesel', pump: 2 },
    { k: '3', label: 'West Regular', pump: 3 },
    { k: '4', label: 'West Diesel', pump: 4 },
  ]

  return (
    <div className="p-4 space-y-3 overflow-y-auto relative" style={{ paddingBottom: NAV_HEIGHT }}>
      <div className="mb-2 flex items-center gap-2 text-sm text-neutral-600">
        <span className="mr-1">Open chooser:</span>
        <Keycap label={9} />
      </div>

      {rows.map((r, idx) => {
        const rowKey = keyOf(r)
        const baseAnalog = baseAnalogByKey[rowKey] ?? 0
        const pumpNumber = idx + 1
        return (
          <div key={rowKey} className="rounded-xl border p-4 shadow-sm border-neutral-200">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wide text-neutral-500">Pump</span>
                <span className="text-base font-semibold">{pumpNumber}</span>
                <span className="text-neutral-400">•</span>
                <span className="text-sm font-medium">{r.product_label}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-neutral-600">
                <span className="mr-1">Hotkey</span>
                <Keycap label={9} />
                <span>→</span>
                <Keycap label={pumpNumber} />
              </div>
            </div>

            <RowCard
              row={r}
              isEditing={false}
              baseAnalog={baseAnalog}
              onStartEdit={() => gotoPump(pumpNumber)}
              onCancelEdit={() => {}}
              onSaveEdit={(_: Partial<UpdateRecord>) => {}}
            />
          </div>
        )
      })}

      {chooserOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setChooserOpen(false)} />
          <div role="dialog" aria-modal="true" className="relative z-10 w-full max-w-sm mx-4 rounded-xl border bg-white p-4 shadow-xl">
            <div className="mb-3 text-sm font-medium text-neutral-700">Select Pump</div>
            <div className="grid grid-cols-1 gap-2">
              {CHOICES.map(({ k, label, pump }) => {
                const isLoading = loadingPump === pump
                return (
                  <button
                    key={k}
                    onClick={() => gotoPump(pump)}
                    disabled={!!loadingPump}
                    className={`flex items-center justify-between rounded-lg border px-3 py-2 text-left text-sm hover:bg-neutral-50 active:bg-neutral-100 ${
                      loadingPump ? 'opacity-60 pointer-events-none' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Keycap label={k} />
                      <span>{label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {isLoading && <span className="inline-block w-4 h-4 rounded-full border-2 border-neutral-300 border-t-neutral-700 animate-spin" />}
                      <span className="text-xs text-neutral-500">Pump {pump}</span>
                    </div>
                  </button>
                )
              })}
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-neutral-500">
              <div className="flex items-center gap-1">
                <span>Press</span>
                <Keycap label={1} />
                <Keycap label={2} />
                <Keycap label={3} />
                <Keycap label={4} />
              </div>
              <div className="flex items-center gap-1">
                <span>Close</span>
                <Keycap label="0" />
                <span>or</span>
                <Keycap label="Esc" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
