// src/components/purchase-orders/types.ts
export type PurchaseOrder = {
  id: string
  po_number: string
  plate_number: string
  route: string
  driver: string
  date: string
}

export type NozzleSpec = { id: "regular" | "diesel"; product: "Regular" | "Diesel" }
export type DispenserSpec = {
  dispenser_id: "dispenser_east" | "dispenser_west"
  location: "East" | "West"
  nozzles: NozzleSpec[]
}
