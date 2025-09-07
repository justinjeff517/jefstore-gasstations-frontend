"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { PurchaseOrder } from "./types"

export default function PurchaseOrderList({ orders }: { orders: PurchaseOrder[] }) {
  if (orders.length === 0) {
    return <p className="text-sm text-muted-foreground">No purchase orders yet.</p>
  }

  return (
    <div className="space-y-3">
      {orders.map((o) => (
        <article
          key={o.id}
          className="rounded-lg border p-3 grid grid-cols-1 sm:grid-cols-2 gap-2"
        >
          <div>
            <div className="text-xs uppercase tracking-wide text-muted-foreground">
              PO Number
            </div>
            <div className="font-medium">{o.po_number || "—"}</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Date</div>
            <div className="font-medium">{o.date || "—"}</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wide text-muted-foreground">
              Plate Number
            </div>
            <div className="font-medium">{o.plate_number || "—"}</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Route</div>
            <div className="font-medium">{o.route || "—"}</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Driver</div>
            <div className="font-medium">{o.driver || "—"}</div>
          </div>
          <div className="sm:col-span-2 flex justify-between items-center pt-1">
            <Button size="sm" variant="secondary" asChild>
              <Link href={`/purchase-orders/${o.id}`}>View</Link>
            </Button>
            <span className="text-xs text-muted-foreground">id: {o.id}</span>
          </div>
        </article>
      ))}
    </div>
  )
}
