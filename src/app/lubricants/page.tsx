'use client'

import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Pencil } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'

type Lubricant = {
  name: string
  unit: string
  beginning_inventory: number
  addstock: number
  po: number
  cash: number
  price: number
}

const initialCatalog: Lubricant[] = [
  { name: 'Shell Helix 10W-40',      unit: 'L', beginning_inventory: 120, addstock: 0, po: 0, cash: 0, price: 380 },
  { name: 'Shell Advance 4T 15W-50', unit: 'L', beginning_inventory: 90,  addstock: 0, po: 0, cash: 0, price: 420 },
  { name: 'Shell Helix 5W-30',       unit: 'L', beginning_inventory: 75,  addstock: 0, po: 0, cash: 0, price: 450 },
  { name: 'Shell Rimula R4X 15W-40', unit: 'L', beginning_inventory: 60,  addstock: 0, po: 0, cash: 0, price: 510 },
  { name: 'Shell Advance AX7 10W-40',unit: 'L', beginning_inventory: 80,  addstock: 0, po: 0, cash: 0, price: 395 },
  { name: 'Shell Advance Ultra 5W-40',unit:'L', beginning_inventory: 40,  addstock: 0, po: 0, cash: 0, price: 690 },
  { name: 'Shell Helix HX7 10W-40',  unit: 'L', beginning_inventory: 110, addstock: 0, po: 0, cash: 0, price: 420 },
  { name: 'Shell Helix HX5 15W-40',  unit: 'L', beginning_inventory: 95,  addstock: 0, po: 0, cash: 0, price: 360 },
  { name: 'Shell Advance 4T AX5 20W-50', unit: 'L', beginning_inventory: 85, addstock: 0, po: 0, cash: 0, price: 310 },
  { name: 'Shell Advance Long Ride 10W-40', unit:'L', beginning_inventory: 55, addstock: 0, po: 0, cash: 0, price: 520 },
]

const currency = (v: number) =>
  `₱ ${Number.isFinite(v) ? v.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}`

export default function LubricantsPage() {
  const [rows, setRows] = useState<Lubricant[]>(initialCatalog)
  const [editing, setEditing] = useState<string | null>(null)
  const [draft, setDraft] = useState<{ addstock: number; po: number; cash: number; price: number }>({ addstock: 0, po: 0, cash: 0, price: 0 })

  const catalogNames = useMemo(() => initialCatalog.map(x => x.name), [])
  const defaultPick = useMemo(() => catalogNames.slice(0, 3), [catalogNames])
  const [selectedNames, setSelectedNames] = useState<string[]>(defaultPick)
  const [dialogOpen, setDialogOpen] = useState(false)

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
      console.log('Updated Lubricants:', updated)
      return updated
    })
    setEditing(null)
  }

  const filteredRows = useMemo(
    () => rows.filter(r => selectedNames.includes(r.name)),
    [rows, selectedNames]
  )

  return (
    <div className="p-4 space-y-4 pb-24">
      <div className="flex items-center gap-2">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="default">Select Products ({selectedNames.length}/{catalogNames.length})</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Choose products to show today</DialogTitle>
            </DialogHeader>

            <div className="text-xs opacity-70 -mt-2">Tip: Only 3–10 products typically sell per day.</div>

            <ScrollArea className="h-64 rounded-md border p-2">
              <div className="space-y-2">
                {catalogNames.map(name => {
                  const checked = selectedNames.includes(name)
                  return (
                    <label key={name} className="flex items-center gap-3 rounded-md p-2 hover:bg-muted cursor-pointer">
                      <Checkbox
                        checked={checked}
                        onCheckedChange={(v) => {
                          const on = Boolean(v)
                          setSelectedNames(prev =>
                            on ? Array.from(new Set([...prev, name])) : prev.filter(x => x !== name)
                          )
                        }}
                      />
                      <span className="text-sm">{name}</span>
                    </label>
                  )
                })}
              </div>
            </ScrollArea>

            <div className="flex justify-between gap-2">
              <div className="flex gap-2">
                <Button type="button" variant="secondary" onClick={() => setSelectedNames([])}>Clear</Button>
                <Button type="button" variant="secondary" onClick={() => setSelectedNames(defaultPick)}>Quick 3</Button>
                <Button type="button" variant="secondary" onClick={() => setSelectedNames(catalogNames)}>All</Button>
              </div>
              <DialogFooter>
                <Button onClick={() => setDialogOpen(false)}>Apply</Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {filteredRows.length === 0 && (
        <div className="text-sm opacity-70">No products selected. Click “Select Products” to pick items.</div>
      )}

      {filteredRows.map(r => {
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
              {!isEditing && (
                <Button onClick={() => startEdit(r.name)} variant="secondary" size="sm" className="flex items-center gap-2">
                  <Pencil className="w-4 h-4" />
                  Change
                </Button>
              )}
            </div>

            {!isEditing && (
              <>
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

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="rounded-lg bg-muted p-2 text-center col-span-3">
                    <div className="font-semibold">
                      {(r.beginning_inventory + r.addstock - (r.po + r.cash)).toLocaleString()} {r.unit}
                    </div>
                    <div className="opacity-70">Ending</div>
                  </div>
                </div>
              </>
            )}

            {isEditing && (
              <>
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
                    <div className="font-semibold">{(poLive + cashLive).toLocaleString()} {r.unit}</div>
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
