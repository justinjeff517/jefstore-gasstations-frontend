"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import LatestPurchaseOrders, { PurchaseOrder } from "@/components/purchase-orders/latest-purchase-orders";

const DATA: PurchaseOrder[] = [
  { id: "1", date: "2025-09-16", po_number: "PO-1024", vehicle: "Truck-12", product: "Diesel",   quantity: 5000, driver: "Juan Dela Cruz", route: "East Depot" },
  { id: "2", date: "2025-09-15", po_number: "PO-1023", vehicle: "Van-07",   product: "Gasoline", quantity: 3000, driver: "Maria Santos",   route: "West Depot" },
  { id: "3", date: "2025-09-14", po_number: "PO-1022", vehicle: "Truck-08", product: "Diesel",   quantity: 4500, driver: "Pedro Ramos",    route: "North Depot" },
  { id: "4", date: "2025-09-13", po_number: "PO-1021", vehicle: "Truck-03", product: "Gasoline", quantity: 2500, driver: "Ana Cruz",       route: "South Depot" },
];

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-3xl p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold">Purchase Orders</h1>
        <Link href="http://localhost:3000/purchase-orders/add">
          <Button>Add Purchase Order</Button>
        </Link>
      </div>
      <LatestPurchaseOrders data={DATA} />
    </main>
  );
}
