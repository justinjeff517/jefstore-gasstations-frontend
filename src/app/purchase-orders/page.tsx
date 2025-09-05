"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Keycap } from "@/components/Keycap";

type PurchaseOrder = {
  id: string;
  po_number: string;
  plate_number: string;
  route: string;
  driver: string;
  date: string;
};

type NozzleSpec = { id: "nozzle_1" | "nozzle_2"; product: "Diesel" | "Regular" };
type DispenserSpec = {
  dispenser_id: "dispenser_1" | "dispenser_2";
  location: "East" | "West";
  nozzles: NozzleSpec[];
};

const DISPENSERS: DispenserSpec[] = [
  { dispenser_id: "dispenser_1", location: "East", nozzles: [{ id: "nozzle_1", product: "Diesel" }, { id: "nozzle_2", product: "Regular" }] },
  { dispenser_id: "dispenser_2", location: "West", nozzles: [{ id: "nozzle_1", product: "Diesel" }, { id: "nozzle_2", product: "Regular" }] },
];

const STORAGE_KEY = "jef-pos.purchase_orders";

export default function PurchaseOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [dispModalOpen, setDispModalOpen] = useState(false);

  const pumpOptions = useMemo(
    () => [
      { key: "1", label: "East — Diesel", path: `/purchase-orders/dispenser_1?nozzle=nozzle_1` },
      { key: "2", label: "East — Regular", path: `/purchase-orders/dispenser_1?nozzle=nozzle_2` },
      { key: "3", label: "West — Diesel", path: `/purchase-orders/dispenser_2?nozzle=nozzle_1` },
      { key: "4", label: "West — Regular", path: `/purchase-orders/dispenser_2?nozzle=nozzle_2` },
    ],
    []
  );

  const todayIso = useMemo(() => new Date().toISOString().slice(0, 10), []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setOrders(JSON.parse(raw));
      } else {
        const sample: PurchaseOrder[] = [
          { id: "PO-SAMPLE-1", po_number: "PO-2025-0001", plate_number: "ABC-1234", route: "North Loop", driver: "Juan D.", date: todayIso },
        ];
        setOrders(sample);
      }
    } catch {}
  }, [todayIso]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    } catch {}
  }, [orders]);

  function isEditableTarget(t: EventTarget | null) {
    if (!(t instanceof HTMLElement)) return false;
    const tag = t.tagName.toLowerCase();
    return tag === "input" || tag === "textarea" || tag === "select" || t.isContentEditable;
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (!dispModalOpen) {
        if (e.key === "9" && !isEditableTarget(e.target)) {
          e.preventDefault();
          setDispModalOpen(true);
        }
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        setDispModalOpen(false);
        return;
      }
      const opt = pumpOptions.find((o) => o.key === e.key);
      if (opt) {
        e.preventDefault();
        setDispModalOpen(false);
        router.push(opt.path);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dispModalOpen, pumpOptions, router]);

  function onDelete(id: string) {
    if (!confirm("Delete this purchase order?")) return;
    setOrders((prev) => prev.filter((o) => o.id !== id));
  }

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-2xl px-4">
          <div className="h-12 flex items-center justify-between gap-3">
            <div className="text-sm font-semibold">Purchase Orders</div>
            <div className="text-[11px] text-muted-foreground flex items-center gap-2">
              <span className="hidden sm:inline">Shortcuts:</span>
              <span className="flex items-center gap-1">
                <Keycap label={9} /> <span>Open Pump Picker</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Keycap label={1} /> <Keycap label={2} /> <Keycap label={3} /> <Keycap label={4} /> <span>Go to Pump</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Keycap label="Esc" /> <span>Close</span>
              </span>
            </div>
          </div>
        </div>
      </header>

      <Dialog open={dispModalOpen} onOpenChange={setDispModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Select Pump <span className="text-xs text-muted-foreground">(press <Keycap label={1} />–<Keycap label={4} />)</span>
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {pumpOptions.map((o) => (
              <button
                key={o.key}
                onClick={() => {
                  setDispModalOpen(false);
                  router.push(o.path);
                }}
                className="flex items-center gap-2 rounded-lg border p-3 hover:bg-accent transition"
              >
                <Keycap label={o.key} />
                <div className="text-left">
                  <div className="text-sm font-medium">{o.label}</div>
                  <div className="text-[11px] text-muted-foreground">
                    {o.path.replace("/purchase-orders/", "").replace("?nozzle=", " · ")}
                  </div>
                </div>
              </button>
            ))}
          </div>
          <div className="text-xs text-muted-foreground mt-2">Press <Keycap label="Esc" /> to cancel</div>
        </DialogContent>
      </Dialog>

      <main className="mx-auto max-w-2xl px-4 pt-14 pb-4">
        <section className="space-y-3">
          {orders.length === 0 ? (
            <p className="text-sm text-muted-foreground">No purchase orders yet.</p>
          ) : (
            orders.map((o) => (
              <article key={o.id} className="rounded-lg border p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">PO Number</div>
                  <div className="font-medium">{o.po_number || "—"}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">Date</div>
                  <div className="font-medium">{o.date || "—"}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">Plate Number</div>
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
                <div className="sm:col-span-2 flex gap-2 pt-1">
                  <Button size="sm" variant="destructive" onClick={() => onDelete(o.id)}>
                    Delete
                  </Button>
                  <span className="ml-auto self-center text-xs text-muted-foreground">id: {o.id}</span>
                </div>
              </article>
            ))
          )}
        </section>
      </main>
    </>
  );
}
