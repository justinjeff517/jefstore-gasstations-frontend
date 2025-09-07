// example usage
"use client"

import { PumpPicker } from "@/components/purchase-orders/PumpPicker"
import PurchaseOrderList from "@/components/purchase-orders/PurchaseOrderList"
import type { DispenserSpec, PurchaseOrder } from "@/components/purchase-orders/types"

const DISPENSERS: DispenserSpec[] = [
  {
    dispenser_id: "dispenser_east",
    location: "East",
    nozzles: [
      { id: "regular", product: "Regular" },
      { id: "diesel", product: "Diesel" },
    ],
  },
  {
    dispenser_id: "dispenser_west",
    location: "West",
    nozzles: [
      { id: "regular", product: "Regular" },
      { id: "diesel", product: "Diesel" },
    ],
  },
]

const SAMPLE_ORDERS: PurchaseOrder[] = [
  { id: "1", po_number: "PO-2025-001", date: "2025-09-01", plate_number: "ABC-1234", route: "Manila → Batangas", driver: "Juan Dela Cruz" },
  { id: "2", po_number: "PO-2025-002", date: "2025-09-02", plate_number: "XYZ-5678", route: "Cebu → Toledo", driver: "Ana Santos" },
  { id: "3", po_number: "PO-2025-003", date: "2025-09-03", plate_number: "DEF-9012", route: "Davao → Tagum", driver: "Mario Reyes" },
  { id: "4", po_number: "PO-2025-004", date: "2025-09-04", plate_number: "GHI-3456", route: "Iloilo → Roxas", driver: "Carmen D." },
  { id: "5", po_number: "PO-2025-005", date: "2025-09-05", plate_number: "JKL-7890", route: "Laguna → Cavite", driver: "Ernesto P." },
  { id: "6", po_number: "PO-2025-006", date: "2025-09-06", plate_number: "MNO-1122", route: "Bohol → Cebu", driver: "Sofia L." },
  { id: "7", po_number: "PO-2025-007", date: "2025-09-07", plate_number: "PQR-3344", route: "Quezon → Lucena", driver: "Ricardo V." },
  { id: "8", po_number: "PO-2025-008", date: "2025-09-08", plate_number: "STU-5566", route: "Ormoc → Tacloban", driver: "Andrea G." },
  { id: "9", po_number: "PO-2025-009", date: "2025-09-09", plate_number: "VWX-7788", route: "Naga → Legazpi", driver: "Mark B." },
  { id: "10", po_number: "PO-2025-010", date: "2025-09-10", plate_number: "YZA-9900", route: "Cagayan → Ilocos", driver: "Isabel T." },
]

export default function Page() {
  return (
    <main className="mx-auto max-w-2xl px-4 pt-14 pb-4 space-y-4">
      {/* Keyboard shortcut hint */}
      <div className="text-xs text-muted-foreground text-center">
        Press <kbd className="px-1 py-0.5 border rounded">9</kbd> to open Pump Picker
      </div>

      <PumpPicker dispensers={DISPENSERS} />
      <PurchaseOrderList orders={SAMPLE_ORDERS} />
    </main>
  )
}
