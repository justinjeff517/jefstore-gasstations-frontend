"use client";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

type ApiData = {
  ok: boolean;
  data?: {
    id: string;
    created_at: string;
    location: string;
    date: string;
    dispenser_name: string;
    pump_id: string;
    pump_name: string;
    product: string;
    unit: string;
    price: string;
    beginning_inventory: string;
    calibration: string;
    po: string;
    cash: string;
    ending_inventory: string;
    starting_liter_meter: string;
    ending_liter_meter: string;
    next_date?: string;
    is_matching_today?: boolean;
  };
  error?: string;
};

function peso(n?: string | number) {
  const v = typeof n === "string" ? parseFloat(n.replace(/,/g, "")) : (n ?? 0);
  return isFinite(v) ? new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(v) : String(n ?? "");
}
function prettyDate(s?: string) {
  if (!s) return "";
  const hasZ = /[zZ]|[+\-]\d{2}:?\d{2}$/.test(s);
  const iso = s.includes("T") ? s : s.replace(" ", "T");
  const d = new Date(hasZ ? iso : iso + "Z");
  return isNaN(d.getTime()) ? s : d.toLocaleString("en-PH", { timeZone: "Asia/Manila" });
}
function formatShortDate(s?: string) {
  if (!s) return "next date";
  const hasTZ = /[zZ]|[+\-]\d{2}:?\d{2}$/.test(s);
  const iso = s.includes("T") ? s : s.replace(" ", "T");
  const d = new Date(hasTZ ? iso : iso + "Z");
  if (isNaN(d.getTime())) return "next date";
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "2-digit", year: "numeric", timeZone: "Asia/Manila" }).format(d);
}

export default function Page() {
  const { data: session, status } = useSession();
  const { id } = useParams();
  const pumpId = useMemo(() => (Array.isArray(id) ? String(id[0] ?? "") : String(id ?? "")), [id]);
  const location = (session?.user as any)?.location ?? "";

  const [answered, setAnswered] = useState(false);
  const [resp, setResp] = useState<ApiData | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const canQuery = status === "authenticated" && !!location && !!pumpId;

  useEffect(() => {
    if (!canQuery) {
      setAnswered(true);
      setResp(null);
      setErr(null);
      return;
    }

    const ctrl = new AbortController();
    const url = `/api/pump-inventories/get-by-pump-id-and-location?location=${encodeURIComponent(location)}&pump_id=${encodeURIComponent(pumpId)}`;

    (async () => {
      setAnswered(false);
      setErr(null);
      setResp(null);
      try {
        const r = await fetch(url, { cache: "no-store", signal: ctrl.signal });
        const j = (await r.json()) as ApiData;
        setResp(j);
        if (!r.ok || !j.ok) setErr(j.error ?? `Request failed: ${r.status}`);
      } catch (e: any) {
        if (e.name !== "AbortError") setErr(e.message || "Network error");
      } finally {
        setAnswered(true);
      }
    })();

    return () => ctrl.abort();
  }, [canQuery, location, pumpId]);

  if (status !== "authenticated") return null;

  if (!answered) return <LoadingScreen />;

  const d = resp?.data;
  const dispensed = d
    ? Math.max(
        0,
        (parseFloat((d.ending_liter_meter || "0").replace(/,/g, "")) -
          parseFloat((d.starting_liter_meter || "0").replace(/,/g, ""))) || 0
      )
    : undefined;

  const canCreate = !!d && resp?.ok === true && d.is_matching_today === false;

  return (
    <div className="space-y-3">
      <header>
        <h1 className="text-lg sm:text-xl font-semibold tracking-tight leading-tight">
          Pump {pumpId} • {location || "—"}
        </h1>
        <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">Latest inventory snapshot (Asia/Manila)</p>
      </header>

      {!location && <p className="text-destructive text-sm sm:text-base">Missing user location in session.</p>}

      {err && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-red-700 text-sm sm:text-base">
          {err}
        </div>
      )}

      {!err && resp?.ok && d && (
        <div className="rounded-2xl border shadow-sm overflow-hidden bg-card">
          <div className="grid grid-cols-2 gap-1 px-3 py-2 bg-muted text-sm sm:text-base font-semibold">
            <div>Details</div>
            <div>Value</div>
          </div>

          <Row label="Pump">{d.pump_name}</Row>
          <Row label="Product">{`${d.product} (${d.unit})`}</Row>
          <Row label="Dispenser">{d.dispenser_name}</Row>
          <Row label="Record Date">{prettyDate(d.date)}</Row>
          <Row label="Price">{peso(d.price)}</Row>
          <Row label="Beginning Inventory">{Number(d.beginning_inventory).toLocaleString()}</Row>
          <Row label="Calibration">{Number(d.calibration).toLocaleString()}</Row>
          <Row label="Purchase Orders (PO)">{Number(d.po)}</Row>
          <Row label="Cash Sales">{Number(d.cash)}</Row>
          <Row label="Ending Inventory">{Number(d.ending_inventory).toLocaleString()}</Row>
          <Row label="Starting Liter Meter">{Number(d.starting_liter_meter).toLocaleString()}</Row>
          <Row label="Ending Liter Meter">{Number(d.ending_liter_meter).toLocaleString()}</Row>
          <Row label="Dispensed (by meter)">{Number.isFinite(dispensed) ? `${dispensed} ${d.unit}` : "—"}</Row>
 
          <Row label="Record ID">{d.id}</Row>
          <Row label="Created At">{prettyDate(d.created_at)}</Row>
        </div>
      )}

      <div className="flex justify-end">
        <Button
          disabled={!canCreate}
          title={canCreate ? "" : "Button enabled only when today has no matching inventory"}
          onClick={() => window.location.assign("/dispensers/5/create")}
        >
          {`Create Pump Inventory for ${formatShortDate(d?.next_date)}`}
        </Button>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-2 gap-1 px-3 py-2 border-t text-sm sm:text-[15px] leading-snug">
      <div className="text-muted-foreground">{label}</div>
      <div className="font-medium break-words [word-break:break-word]">{children}</div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-background/95">
      <div className="flex items-center gap-3 rounded-xl border px-5 py-4 bg-card shadow">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
        <span className="text-sm">Loading latest pump inventory…</span>
      </div>
    </div>
  );
}
