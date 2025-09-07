"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Keycap } from "@/components/Keycap"
import type { DispenserSpec } from "./types"

function isEditableTarget(t: EventTarget | null) {
  if (!(t instanceof HTMLElement)) return false
  const tag = t.tagName.toLowerCase()
  return tag === "input" || tag === "textarea" || tag === "select" || t.isContentEditable
}

export function PumpPicker({
  dispensers,
  hotkey = "9",
  maxHotkeys = 9,
  onSelect, // called with the resolved path
  basePath = "/purchase-orders",
}: {
  dispensers: DispenserSpec[]
  hotkey?: string
  maxHotkeys?: number
  onSelect?: (path: string) => void
  basePath?: string
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  // Build options -> /purchase-orders/[fuel_dispenser_id]/[product]
  const options = useMemo(() => {
    const flat = dispensers.flatMap((d) =>
      d.nozzles.map((n) => ({
        key: "",
        label: `${d.location} — ${n.product}`,
        path: `${basePath}/${d.dispenser_id}/${n.id}`,
        sublabel: `${d.dispenser_id} · ${n.id}`,
      })),
    )
    return flat.slice(0, maxHotkeys).map((o, i) => ({ ...o, key: String(i + 1) }))
  }, [dispensers, maxHotkeys, basePath])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat) return
      if (!open) {
        if (e.key === hotkey && !isEditableTarget(e.target)) {
          e.preventDefault()
          setOpen(true)
        }
        return
      }
      if (e.key === "Escape") {
        e.preventDefault()
        setOpen(false)
        return
      }
      const opt = options.find((o) => o.key === e.key)
      if (opt) {
        e.preventDefault()
        setOpen(false)
        onSelect?.(opt.path)
        router.push(opt.path)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, hotkey, options, router, onSelect])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Select Pump
            <span className="text-xs text-muted-foreground">
              (press <Keycap label={1} />–<Keycap label={options.length || 1} />)
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {options.map((o) => (
            <button
              key={o.key}
              onClick={() => {
                setOpen(false)
                onSelect?.(o.path)
                router.push(o.path)
              }}
              className="flex items-center gap-2 rounded-lg border p-3 hover:bg-accent transition"
              aria-label={`Go to ${o.label}`}
            >
              <Keycap label={o.key} />
              <div className="text-left">
                <div className="text-sm font-medium">{o.label}</div>
                <div className="text-[11px] text-muted-foreground">{o.sublabel}</div>
              </div>
            </button>
          ))}
        </div>

        <div className="text-xs text-muted-foreground mt-2">
          Press <Keycap label="Esc" /> to cancel • Press <Keycap label={hotkey} /> to open
        </div>
      </DialogContent>
    </Dialog>
  )
}
