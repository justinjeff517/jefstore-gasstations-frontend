/* src/components/purchase-orders/internal/ResultCard.tsx */
"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { FuelPO } from "./types";

type Props = { result: FuelPO | null };

export default function ResultCard({ result }: Props) {
  if (!result) return null;
  return (
    <Card className="rounded-2xl">
      <CardContent className="p-4">
        <div className="mb-2 font-medium">Result</div>
        <div className="grid gap-1 text-sm">
          <div>
            PO #: <span className="font-mono">{result.po_number}</span>
          </div>
          <div>Type: {result.type}</div>
          {result.fuel && (
            <>
              <div>Vehicle: {result.fuel.plate_number || "—"}</div>
              <div>Route: {result.fuel.route || "—"}</div>
              <div>Driver: {result.fuel.driver || "—"}</div>
              <div>Product: {result.fuel.product || "—"}</div>
              <div>Qty: {result.fuel.quantity ?? "—"}</div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
