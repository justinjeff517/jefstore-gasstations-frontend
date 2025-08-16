'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Pencil } from 'lucide-react'

type NozzleRecord = {
  dispenser: string
  beginning_register: number
  calibration: number
  po: number
  cash: number
  price: number
  ending_register: number
  analog_register: number
}

type DispenserRecord = {
  nozzles: NozzleRecord[]
}

type Row = {
  Product: string
  BeginningRegister: number
  Calibration: number
  PO: number
  Cash: number
  Sold: number
  EndingRegister: number
  Unit: string
  Price: number
  AnalogRegister: number
  submitted: boolean
}

const fuelData: DispenserRecord[] = [
  {
    nozzles: [
      { dispenser: 'Dispenser A — Regular', beginning_register: 1200, calibration: 0, po: 0, cash: 0, price: 65.0, ending_register: 0, analog_register: 0 },
      { dispenser: 'Dispenser A — Diesel',  beginning_register: 1500, calibration: 0, po: 0, cash: 0, price: 68.5, ending_register: 0, analog_register: 0 },
      { dispenser: 'Dispenser B — Regular', beginning_register: 1100, calibration: 0, po: 0, cash: 0, price: 65.0, ending_register: 0, analog_register: 0 },
      { dispenser: 'Dispenser B — Diesel',  beginning_register: 1400, calibration: 0, po: 0, cash: 0, price: 68.5, ending_register: 0, analog_register: 0 },
    ],
  },
]

// 🔹 Build an immutable map of initial analog registers from fuelData
const initialAnalogByProduct: Record<string, number> = Object.fromEntries(
  fuelData.flatMap(d =>
    d.nozzles.map(n => [n.dispenser, n.analog_register ?? 0] as const)
  )
)

const initialRows: Row[] = fuelData.flatMap(d =>
  d.nozzles.map(n => {
    const sold = Math.max(0, (n.po || 0) + (n.cash || 0))
    const end = Math.max(0, n.beginning_register + (n.calibration || 0) - sold)
    return {
      Product: n.dispenser,
      BeginningRegister: n.beginning_register,
      Calibration: n.calibration,
      PO: n.po,
      Cash: n.cash,
      Sold: sold,
      EndingRegister: end,
      Unit: 'L',
      Price: n.price,
      AnalogRegister: n.analog_register || 0,
      submitted: true,
    }
  })
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
  const [baseAnalog, setBaseAnalog] = useState<number>(0)

  const currency = (v: number) =>
    `₱ ${Number.isFinite(v) ? v.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}`

  const startEdit = (product: string) => {
    const r = rows.find(x => x.Product === product)
    if (!r) return
    setDraft({ calibration: r.Calibration, po: r.PO, cash: r.Cash, price: r.Price })
    setBaseAnalog(initialAnalogByProduct[product] ?? 0)
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

      const sold = Math.max(0, po + cash)
      const ending = Math.max(0, r.BeginningRegister + calibration + sold + cash)

      return {
        ...r,
        Calibration: calibration,
        PO: po,
        Cash: cash,
        Sold: sold,
        EndingRegister: ending,
        Price: price,
        AnalogRegister: baseAnalog + calibration + po + cash,
        submitted: true,
      }
    })
  )
  setEditing(null)
}


  const NAV_HEIGHT = 64

  return (
    <div className="p-4 space-y-3 overflow-y-auto" style={{ paddingBottom: NAV_HEIGHT }}>
      {rows.map(r => {
        const isEditing = editing === r.Product
        const borderColor = isEditing ? 'border-red-500' : r.submitted ? 'border-green-500' : 'border-red-500'

        return (
          <div key={r.Product} className={`rounded-xl border p-4 shadow-sm flex flex-col gap-3 ${borderColor}`}>
            <div className="font-medium text-base break-words truncate" title={r.Product}>{r.Product}</div>

            {!isEditing && (
              <>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  {[{ label: 'Beginning', qty: r.BeginningRegister },
                    { label: 'Sold', qty: r.Sold },
                    { label: 'Ending', qty: r.EndingRegister }].map(({ label, qty }) => (
                    <div key={label} className="rounded-lg bg-muted p-2 text-center flex flex-col justify-center">
                      <div className="font-semibold">{qty.toLocaleString()} {r.Unit}</div>
                      <div className="text-xs opacity-70">{currency(qty * r.Price)}</div>
                      <div className="text-[10px] opacity-60">{label}</div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-5 gap-2 text-xs">
                  <div className="rounded-lg bg-muted p-2 text-center">
                    <div className="font-semibold">{r.Calibration}</div>
                    <div className="opacity-70">Calibration</div>
                  </div>
                  <div className="rounded-lg bg-muted p-2 text-center">
                    <div className="font-semibold">{r.PO}</div>
                    <div className="opacity-70">PO</div>
                  </div>
                  <div className="rounded-lg bg-muted p-2 text-center">
                    <div className="font-semibold">{r.Cash}</div>
                    <div className="opacity-70">Cash</div>
                  </div>
                  <div className="rounded-lg bg-muted p-2 text-center">
                    <div className="font-semibold">{r.Price.toFixed(2)}</div>
                    <div className="opacity-70">₱/L</div>
                  </div>
                  <div className="rounded-lg bg-muted p-2 text-center">
                    <div className="font-semibold">{r.AnalogRegister.toLocaleString()}</div>
                    <div className="opacity-70">Analog Reg.</div>
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
                    <div className="text-xs opacity-70">Cash ({r.Unit})</div>
                    <Input
                      type="number"
                      min="0"
                      value={draft.cash}
                      onChange={(e) => setDraft(d => ({ ...d, cash: toNum(e.target.value) }))}
                      className="text-center"
                    />
                  </div>

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
