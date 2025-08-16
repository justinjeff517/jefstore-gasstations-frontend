'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Pencil } from 'lucide-react'

type Lubricant = {
  name: string
  unit: string
  beginning_inventory: number
  addstock: number
  po: number
  cash: number
  price: number
}

const initialLubricants: Lubricant[] = [
  { name: 'Shell Helix 10W-40',      unit: 'L', beginning_inventory: 120, addstock: 0, po: 0, cash: 0, price: 380 },
  { name: 'Shell Advance 4T 15W-50', unit: 'L', beginning_inventory: 90,  addstock: 0, po: 0, cash: 0, price: 420 },
]

const currency = (v: number) =>
  `₱ ${Number.isFinite(v) ? v.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}`

export default function LubricantsPage() {
  const [rows, setRows] = useState<Lubricant[]>(initialLubricants)
  const [editing, setEditing] = useState<string | null>(null)
  const [draft, setDraft] = useState<{ addstock: number; po: number; cash: number; price: number }>({
    addstock: 0, po: 0, cash: 0, price: 0
  })

  const toNum = (v: any) => (Number.isFinite(Number(v)) ? Number(v) : 0)
  const clampNonNeg = (n: number) => Math.max(0, n)

  const startEdit = (name: string) => {
    const r = rows.find(x => x.name === name)
    if (!r) return
    setDraft({ addstock: r.addstock, po: r.po, cash: r.cash, price: r.price })
    setEditing(name)
  }

  const cancelEdit = () => setEditing(null)

  const saveEdit = () => {
    if (!editing) return
    setRows(prev => {
      const updated = prev.map(r => {
        if (r.name !== editing) return r
        return {
          ...r,
          addstock: clampNonNeg(toNum(draft.addstock)),
          po: clampNonNeg(toNum(draft.po)),
          cash: clampNonNeg(toNum(draft.cash)),
          price: clampNonNeg(toNum(draft.price)),
        }
      })
      console.log("Updated Lubricants:", updated) // ✅ log all items
      return updated
    })
    setEditing(null)
  }


  return (
    <div className="p-4 space-y-4 pb-24">
      {rows.map(r => {
        const isEditing = editing === r.name
        const addstockLive = isEditing ? clampNonNeg(toNum(draft.addstock)) : r.addstock
        const poLive = isEditing ? clampNonNeg(toNum(draft.po)) : r.po
        const cashLive = isEditing ? clampNonNeg(toNum(draft.cash)) : r.cash
        const priceLive = isEditing ? clampNonNeg(toNum(draft.price)) : r.price

        const sold = clampNonNeg(poLive + cashLive)
        const ending = clampNonNeg(r.beginning_inventory + addstockLive - sold)

        return (
          <div
            key={r.name}
            className={`rounded-xl border p-4 shadow-sm flex flex-col gap-3 ${isEditing ? 'border-red-500' : 'border-green-500'}`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="font-medium text-base break-words truncate" title={r.name}>
                {r.name}
              </div>
            </div>

            {!isEditing && (
              <>
                {/* Row 1: Beginning, Add Stock, PO */}
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="rounded-lg bg-muted p-2 text-center">
                    <div className="font-semibold">{r.beginning_inventory.toLocaleString()} {r.unit}</div>
                    <div className="opacity-70">Beginning</div>
                  </div>
                  <div className="rounded-lg bg-muted p-2 text-center">
                    <div className="font-semibold">{r.addstock.toLocaleString()} {r.unit}</div>
                    <div className="opacity-70">Add Stock</div>
                  </div>
                  <div className="rounded-lg bg-muted p-2 text-center">
                    <div className="font-semibold">{r.po.toLocaleString()} {r.unit}</div>
                    <div className="opacity-70">PO</div>
                  </div>
                </div>

                {/* Row 2: Cash, Sold, Price */}
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="rounded-lg bg-muted p-2 text-center">
                    <div className="font-semibold">{r.cash.toLocaleString()} {r.unit}</div>
                    <div className="opacity-70">Cash</div>
                  </div>
                  <div className="rounded-lg bg-muted p-2 text-center">
                    <div className="font-semibold">{(r.po + r.cash).toLocaleString()} {r.unit}</div>
                    <div className="opacity-70">Sold</div>
                  </div>
                  <div className="rounded-lg bg-muted p-2 text-center">
                    <div className="font-semibold">{r.price.toFixed(2)}</div>
                    <div className="opacity-70">₱/{r.unit}</div>
                  </div>
                </div>

                {/* Row 3: Ending */}
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="rounded-lg bg-muted p-2 text-center col-span-3">
                    <div className="font-semibold">
                      {(r.beginning_inventory + r.addstock - (r.po + r.cash)).toLocaleString()} {r.unit}
                    </div>
                    <div className="opacity-70">Ending</div>
                  </div>
                </div>

                <Button onClick={() => startEdit(r.name)} variant="secondary" className="w-full flex items-center gap-2">
                  <Pencil className="w-4 h-4" />
                  Change
                </Button>
              </>
            )}

            {isEditing && (
              <>
                {/* Inputs Row 1: Add Stock, PO, Cash */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <div className="text-xs opacity-70">Add Stock ({r.unit})</div>
                    <Input
                      type="number"
                      min="0"
                      value={draft.addstock}
                      onChange={e => setDraft(d => ({ ...d, addstock: toNum(e.target.value) }))}
                      className="text-center"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs opacity-70">PO ({r.unit})</div>
                    <Input
                      type="number"
                      min="0"
                      value={draft.po}
                      onChange={e => setDraft(d => ({ ...d, po: toNum(e.target.value) }))}
                      className="text-center"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs opacity-70">Cash ({r.unit})</div>
                    <Input
                      type="number"
                      min="0"
                      value={draft.cash}
                      onChange={e => setDraft(d => ({ ...d, cash: toNum(e.target.value) }))}
                      className="text-center"
                    />
                  </div>
                </div>

                {/* Inputs Row 2: Price */}
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <div className="space-y-1 col-span-3">
                    <div className="text-xs opacity-70">Price (₱/{r.unit})</div>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={draft.price}
                      onChange={e => setDraft(d => ({ ...d, price: toNum(e.target.value) }))}
                      className="text-center"
                    />
                  </div>
                </div>

                {/* Summary tiles in required order: Beginning, Add Stock, PO, Cash, Sold, Price, Ending */}
                <div className="grid grid-cols-3 gap-2 text-xs mt-2">
                  <div className="rounded-lg bg-muted p-2 text-center">
                    <div className="font-semibold">{r.beginning_inventory.toLocaleString()} {r.unit}</div>
                    <div className="opacity-70">Beginning</div>
                  </div>
                  <div className="rounded-lg bg-muted p-2 text-center">
                    <div className="font-semibold">{addstockLive.toLocaleString()} {r.unit}</div>
                    <div className="opacity-70">Add Stock</div>
                  </div>
                  <div className="rounded-lg bg-muted p-2 text-center">
                    <div className="font-semibold">{poLive.toLocaleString()} {r.unit}</div>
                    <div className="opacity-70">PO</div>
                  </div>

                  <div className="rounded-lg bg-muted p-2 text-center">
                    <div className="font-semibold">{cashLive.toLocaleString()} {r.unit}</div>
                    <div className="opacity-70">Cash</div>
                  </div>
                  <div className="rounded-lg bg-muted p-2 text-center">
                    <div className="font-semibold">{sold.toLocaleString()} {r.unit}</div>
                    <div className="opacity-70">Sold</div>
                  </div>
                  <div className="rounded-lg bg-muted p-2 text-center">
                    <div className="font-semibold">{priceLive.toFixed(2)}</div>
                    <div className="opacity-70">₱/{r.unit}</div>
                  </div>

                  <div className="rounded-lg bg-muted p-2 text-center col-span-3">
                    <div className="font-semibold">{ending.toLocaleString()} {r.unit}</div>
                    <div className="opacity-70">Ending</div>
                  </div>
                </div>

                <div className="text-right text-[11px] opacity-70">
                  {currency(cashLive * priceLive)} Cash Sales • {currency(ending * priceLive)} Ending Value
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
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
