"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type POForm = {
  id: string;
  product: string;
  po_number: string;
  plate_number: string;
  route: string;
  driver: string;
  quantity_liters: string;
};

export default function ManualConfirmPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const dispenserId = String(params.dispenser_id ?? "");
  const [po, setPo] = useState<POForm | null>(null);
  const [printing, setPrinting] = useState(false);

  // Load from sessionStorage first, then fallback to search params
  useEffect(() => {
    const s = sessionStorage.getItem("po.manual.pending");
    if (s) {
      try {
        const parsed = JSON.parse(s) as Partial<POForm>;
        // Only accept if essentials exist
        if (
          parsed &&
          parsed.id &&
          parsed.po_number &&
          parsed.plate_number &&
          parsed.route &&
          parsed.driver &&
          parsed.product
        ) {
          setPo(parsed as POForm);
          return;
        }
      } catch {}
    }
    // Fallback: build from URL params (best-effort)
    const fromParams: POForm = {
      id: String(searchParams.get("id") ?? ""),
      product: String(searchParams.get("product") ?? ""),
      po_number: String(searchParams.get("po_number") ?? ""),
      plate_number: String(searchParams.get("plate_number") ?? ""),
      route: String(searchParams.get("route") ?? ""),
      driver: String(searchParams.get("driver") ?? ""),
      quantity_liters: String(searchParams.get("quantity_liters") ?? ""),
    };
    // Accept only if at least PO number + plate present
    if (fromParams.id && fromParams.po_number) setPo(fromParams);
  }, [searchParams]);

  const missing = useMemo(() => {
    if (!po) return ["po"];
    const req: (keyof POForm)[] = [
      "product",
      "po_number",
      "plate_number",
      "route",
      "driver",
      "quantity_liters",
    ];
    return req.filter((k) => !String(po[k] ?? "").trim());
  }, [po]);

  const onCancel = () => {
    router.back();
  };

  const onConfirmAndPrint = async () => {
    if (!po) return;
    setPrinting(true);
    try {
      // Example REST print endpoint; adjust to your printer API.
      // Include dispenser for context.
      const res = await fetch("/api/thermal/print-po", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...po,
          dispenser_id: dispenserId,
          mode: "manual",
          unit: "liters",
        }),
      });
      if (!res.ok) throw new Error(`Print failed: ${res.status}`);
      // Optionally clear the pending payload
      sessionStorage.removeItem("po.manual.pending");
      // Navigate to a success/receipt page or back to list
      router.push(`/purchase-orders?printed=${encodeURIComponent(po.id)}`);
    } catch (err) {
      console.error(err);
      alert("Printing failed. Please try again.");
    } finally {
      setPrinting(false);
    }
  };

  return (
    <main className="mx-auto max-w-md p-4 space-y-4">
      <h2 className="text-lg font-semibold">Confirm Purchase Order</h2>
      <p className="text-sm text-muted-foreground">Dispenser {dispenserId} • Mode: Manual</p>

      {!po ? (
        <div className="text-sm text-red-600">
          No pending data found. Go back and fill the form.
        </div>
      ) : missing.length ? (
        <div className="text-sm text-red-600">
          Missing: {missing.join(", ")}. Go back and complete the form.
        </div>
      ) : (
        <section className="rounded-lg border p-3 space-y-2">
          <div className="font-semibold">
            {po.po_number} — {po.plate_number}
          </div>
          <Separator />
          <div className="text-sm">
            <div><span className="font-medium">Product:</span> {po.product}</div>
            <div><span className="font-medium">Quantity:</span> {po.quantity_liters} liters</div>
            <div><span className="font-medium">Route:</span> {po.route}</div>
            <div><span className="font-medium">Driver:</span> {po.driver}</div>
            <div className="text-xs text-muted-foreground mt-1">PO ID: {po.id}</div>
          </div>
        </section>
      )}

      <div className="flex gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onConfirmAndPrint} disabled={!po || missing.length > 0 || printing}>
          {printing ? "Confirming & Printing…" : "Confirm & Print"}
        </Button>
      </div>
    </main>
  );
}
