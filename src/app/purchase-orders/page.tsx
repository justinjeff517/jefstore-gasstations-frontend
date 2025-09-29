"use client";

import Link from "next/link";

import LatestPurchaseOrders, { PurchaseOrder } from "@/components/purchase-orders/latest-purchase-orders";
import { Plus, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";

const DATA: PurchaseOrder[] = [
  { id: "1", date: "2025-09-16", po_number: "PO-1024", vehicle: "Truck-12", product: "Diesel",   quantity: 5000, driver: "Juan Dela Cruz", route: "East Depot" },
  { id: "2", date: "2025-09-15", po_number: "PO-1023", vehicle: "Van-07",   product: "Gasoline", quantity: 3000, driver: "Maria Santos",   route: "West Depot" },
  { id: "3", date: "2025-09-14", po_number: "PO-1022", vehicle: "Truck-08", product: "Diesel",   quantity: 4500, driver: "Pedro Ramos",    route: "North Depot" },
  { id: "4", date: "2025-09-13", po_number: "PO-1021", vehicle: "Truck-03", product: "Gasoline", quantity: 2500, driver: "Ana Cruz",       route: "South Depot" },
];

export default function Page() {
  const dataSorted = [...DATA].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <main className="mx-auto w-full max-w-3xl p-4">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Button asChild className="gap-2">
            <Link href="/purchase-orders/add-internal">
              <Plus className="h-5 w-5" aria-hidden="true" />
              Add Internal PO
            </Link>
          </Button>

          <Button asChild variant="secondary" className="gap-2">
            <Link href="/purchase-orders/add-external">
              <Truck className="h-5 w-5" aria-hidden="true" />
              Add External PO
            </Link>
          </Button>
        </div>
      </div>

      <LatestPurchaseOrders data={dataSorted} />
    </main>
  );
}
