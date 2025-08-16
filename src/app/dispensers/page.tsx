'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Pencil } from 'lucide-react'

type NozzleRecord = {
  nozzle: string
  beginning_inventory: number
  calibration: number
  po: number
  cash: number
  price: number
  ending_inventory: number
}
type DispenserRecord = {
  dispenser: string
  nozzles: NozzleRecord[]
}

type Row = {
  Product: string
  BeginningStock: number
  Calibration: number
  PO: number
  Sold: number
  EndingStock: number
  Unit: string
  Price: number
  submitted: boolean
}

const fuelData: DispenserRecord[] = [
  {
    dispenser: 'Dispenser A',
    nozzles: [
      { nozzle: 'Regular', beginning_inventory: 1200, calibration: 0, po: 0, cash: 0, price: 65.0, ending_inventory: 0 },
      { nozzle: 'Diesel',  beginning_inventory: 1500, calibration: 0, po: 0, cash: 0, price: 68.5, ending_inventory: 0 },
    ],
  },
  {
    dispenser: 'Dispenser B',
    nozzles: [
      { nozzle: 'Regular', beginning_inventory: 1100, calibration: 0, po: 0, cash: 0, price: 65.0, ending_inventory: 0 },
      { nozzle: 'Diesel',  beginning_inventory: 1400, calibration: 0, po: 0, cash: 0, price: 68.5, ending_inventory: 0 },
    ],
  },
]


const initialRows: Row[] = fuelData.flatMap(d =>
  d.nozzles.map(n => ({
    Product: `${d.dispenser} — ${n.nozzle}`,
    BeginningStock: n.beginning_inventory,
    Calibration: n.calibration,
    PO: n.po,
    Sold: n.cash,
    EndingStock: n.ending_inventory,
    Unit: 'L',
    Price: n.price,
    submitted: true,
  }))
)

export default function Page() {
  const [rows, setRows] = useState<Row[]>(initialRows)
  const [editing, setEditing] = useState<string | null>(null)
  const [draft, setDraft] = useState<{ calibration: number; po: number; cash: number; price: number }>({
    calibration: 0,
    po: 0,
    cash: 0,
    price: 0,
  })

  const currency = (v: number) =>
    `₱ ${Number.isFinite(v) ? v.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}`

  const startEdit = (product: string) => {
    const r = rows.find(x => x.Product === product)
    if (!r) return
    setDraft({ calibration: r.Calibration, po: r.PO, cash: r.Sold, price: r.Price })
    setEditing(product)
  }

  const cancelEdit = () => setEditing(null)

  const toNum = (v: any) => {
    const n = Number(v)
    return Number.isFinite(n) ? n : 0
  }

  const saveEdit = () => {
    if (!editing) return
    setRows(prev =>
      prev.map(r => {
        if (r.Product !== editing) return r
        const calibration = toNum(draft.calibration)
        const po = Math.max(0, toNum(draft.po))
        const cash = Math.max(0, toNum(draft.cash))
        const price = Math.max(0, toNum(draft.price))
        const ending = r.BeginningStock + calibration + po - cash
        return {
          ...r,
          Calibration: calibration,
          PO: po,
          Sold: cash,
          Price: price,
          EndingStock: Math.max(0, ending),
          submitted: true,
        }
      })
    )
    setEditing(null)
  }

  // 👉 Adjust this to your actual bottom nav height (in px)
  const NAV_HEIGHT = 64

  return (
    <div
      className="p-4 space-y-3 overflow-y-auto"

    >
      {rows.map(r => {
        const isEditing = editing === r.Product
        const begin = r.BeginningStock

        const calibrationLive = isEditing ? toNum(draft.calibration) : r.Calibration
        const poLive = isEditing ? Math.max(0, toNum(draft.po)) : r.PO
        const cashLive = isEditing ? Math.max(0, toNum(draft.cash)) : r.Sold
        const priceLive = isEditing ? Math.max(0, toNum(draft.price)) : r.Price

        const endingComputed = begin + calibrationLive + poLive - cashLive
        const endingLive = Math.max(0, endingComputed)

        const borderColor = isEditing ? 'border-red-500' : r.submitted ? 'border-green-500' : 'border-red-500'

        return (
          <div key={r.Product} className={`rounded-xl border p-4 shadow-sm flex flex-col gap-3 ${borderColor}`}>
            <div className="font-medium text-base break-words truncate" title={r.Product}>{r.Product}</div>

            {!isEditing && (
              <>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  {[{ label: 'Beginning', qty: r.BeginningStock },
                    { label: 'Sold', qty: r.Sold },
                    { label: 'Ending', qty: r.EndingStock }].map(({ label, qty }) => (
                    <div key={label} className="rounded-lg bg-muted p-2 text-center flex flex-col justify-center">
                      <div className="font-semibold">{qty.toLocaleString()} {r.Unit}</div>
                      <div className="text-xs opacity-70">{currency(qty * r.Price)}</div>
                      <div className="text-[10px] opacity-60">{label}</div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div className="rounded-lg bg-muted p-2 text-center">
                    <div className="font-semibold">{r.Calibration}</div>
                    <div className="opacity-70">Calibration</div>
                  </div>
                  <div className="rounded-lg bg-muted p-2 text-center">
                    <div className="font-semibold">{r.PO}</div>
                    <div className="opacity-70">PO</div>
                  </div>
                  <div className="rounded-lg bg-muted p-2 text-center">
                    <div className="font-semibold">{r.Price.toFixed(2)}</div>
                    <div className="opacity-70">₱/L</div>
                  </div>
                  <div className="rounded-lg bg-muted p-2 text-center">
                    <div className="font-semibold">{currency(r.Sold * r.Price)}</div>
                    <div className="opacity-70">Sales</div>
                  </div>
                </div>

                <Button onClick={() => startEdit(r.Product)} variant="secondary" className="w-full flex items-center gap-2">
                  <Pencil className="w-4 h-4" />
                  Change
                </Button>
              </>
            )}

            {isEditing && (
              <>
                <div className="grid grid-cols-4 gap-2">
                  <div className="space-y-1">
                    <div className="text-xs opacity-70">Beginning ({r.Unit})</div>
                    <Input value={begin} disabled className="text-center disabled:opacity-100" />
                    <div className="text-[11px] text-right opacity-70">{currency(begin * priceLive)}</div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-xs opacity-70">Calibration ({r.Unit})</div>
                    <Input
                      type="number"
                      value={draft.calibration}
                      onChange={(e) => setDraft(d => ({ ...d, calibration: toNum(e.target.value) }))}
                      className="text-center"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="text-xs opacity-70">PO ({r.Unit})</div>
                    <Input
                      type="number"
                      min="0"
                      value={draft.po}
                      onChange={(e) => setDraft(d => ({ ...d, po: toNum(e.target.value) }))}
                      className="text-center"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="text-xs opacity-70">Sold ({r.Unit})</div>
                    <Input
                      type="number"
                      min="0"
                      value={draft.cash}
                      onChange={(e) => setDraft(d => ({ ...d, cash: toNum(e.target.value) }))}
                      className="text-center"
                    />
                    <div className="text-[11px] text-right opacity-70">{currency(cashLive * priceLive)}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <div className="text-xs opacity-70">Price (₱/L)</div>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={draft.price}
                      onChange={(e) => setDraft(d => ({ ...d, price: toNum(e.target.value) }))}
                      className="text-center"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="text-xs opacity-70">Ending ({r.Unit})</div>
                    <Input value={endingLive} disabled className="text-center disabled:opacity-100" />
                    <div className="text:[11px] text-right opacity-70">{currency(endingLive * priceLive)}</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={saveEdit} className="w-full">Save</Button>
                  <Button onClick={cancelEdit} variant="secondary" className="w-full">Cancel</Button>
                </div>
              </>
            )}
          </div>
        )
      })}
    </div>
  )
}
