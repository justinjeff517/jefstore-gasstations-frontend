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

type NozzleSpec = { id: "regular" | "diesel"; product: "Regular" | "Diesel" };
type DispenserSpec = {
  dispenser_id: "dispenser_east" | "dispenser_west";
  location: "East" | "West";
  nozzles: NozzleSpec[];
};

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
];

const STORAGE_KEY = "jef-pos.purchase_orders";

function localDateISO(): string {
  const d = new Date();
  const off = d.getTimezoneOffset();
  const local = new Date(d.getTime() - off * 60_000);
  return local.toISOString().slice(0, 10);
}

export default function PurchaseOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [dispModalOpen, setDispModalOpen] = useState(false);

  const pumpOptions = useMemo(() => {
    // Flatten DISPENSERS → options, then assign numeric hotkeys 1..n (max 9)
    const flat = DISPENSERS.flatMap((d) =>
      d.nozzles.map((n) => ({
        label: `${d.location} — ${n.product}`,
        path: `/purchase-orders/${d.dispenser_id}?nozzle=${n.id}`,
      }))
    );
    return flat.slice(0, 9).map((o, i) => ({ key: String(i + 1), ...o }));
  }, []);

  const todayIso = useMemo(localDateISO, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const sample: PurchaseOrder[] = [
        { id: "PO-SAMPLE-1", po_number: "PO-2025-0001", plate_number: "ABC-1234", route: "North Loop", driver: "Juan D.", date: todayIso },
        { id: "PO-SAMPLE-2", po_number: "PO-2025-0002", plate_number: "KLM-5678", route: "South Loop", driver: "Maria G.", date: "2025-09-04" },
        { id: "PO-SAMPLE-3", po_number: "PO-2025-0003", plate_number: "XYZ-9012", route: "East Route", driver: "Pedro L.", date: "2025-09-03" },
        { id: "PO-SAMPLE-4", po_number: "PO-2025-0004", plate_number: "TUV-3456", route: "West Route", driver: "Ana R.", date: "2025-09-02" },
      ];

      if (!raw) {
        setOrders(sample);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sample));
        return;
      }

      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        setOrders(parsed as PurchaseOrder[]);
      } else {
        setOrders(sample);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sample));
      }
    } catch {
      const fallback: PurchaseOrder[] = [
        { id: "PO-SAMPLE-ERR", po_number: "PO-2025-0099", plate_number: "ERR-000", route: "Recovery", driver: "System", date: todayIso },
      ];
      setOrders(fallback);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fallback));
    }
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
                <Keycap label={1} />–<Keycap label={pumpOptions.length} /> <span>Go to Pump</span>
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
              Select Pump{" "}
              <span className="text-xs text-muted-foreground">
                (press <Keycap label={1} />–<Keycap label={pumpOptions.length} />)
              </span>
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
          <div className="text-xs text-muted-foreground mt-2">
            Press <Keycap label="Esc" /> to cancel
          </div>
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
