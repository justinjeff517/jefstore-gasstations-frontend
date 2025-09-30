// src/app/dispensers/[id]/create/page.tsx
"use client";

import { useMemo, useState, useCallback } from "react";
import { useParams, useSearchParams } from "next/navigation";
import PumpInventorySectionFromApi, {
  PumpInventoryComputedPayload,
} from "@/components/dispensers/create/PumpInventorySectionFromApi";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export default function Page() {
  const params = useParams<{ id: string }>();
  const search = useSearchParams();

  const pumpId = params?.id || "";
  const location = search.get("location") || "loboc";

  const apiUrl = useMemo(() => {
    const loc = encodeURIComponent(location);
    const pid = encodeURIComponent(pumpId || "7");
    return `/api/pump-inventories/get-by-pump-id-and-location?location=${loc}&pump_id=${pid}`;
  }, [location, pumpId]);

  const [payload, setPayload] = useState<PumpInventoryComputedPayload | null>(null);
  const [open, setOpen] = useState(false);

  const handleConfirm = useCallback(() => {
    if (!payload) return;
    console.log("Submit Pump Inventory →", payload);
    setOpen(false);
  }, [payload]);

  return (
    <div className="mx-auto max-w-md px-4 pb-24 pt-4 space-y-4">
      <header className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight">Create Pump Inventory</h1>
        <p className="text-sm text-muted-foreground">
          Location: <span className="font-medium">{location}</span> · Pump ID:{" "}
          <span className="font-medium">{pumpId || "—"}</span>
        </p>
      </header>

      <PumpInventorySectionFromApi apiUrl={apiUrl} onComputed={setPayload} />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="w-full" disabled={!payload}>
            Submit
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Submission</DialogTitle>
            <DialogDescription>
              You’re about to submit the computed pump inventory for {location} · Pump {pumpId || "—"}.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-md border px-3 py-2 text-sm bg-muted/40">
            {payload ? (
              <pre className="whitespace-pre-wrap break-all text-xs">
                {JSON.stringify(payload, null, 2)}
              </pre>
            ) : (
              "No data."
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirm}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
