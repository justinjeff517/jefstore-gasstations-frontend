// src/components/dispensers/create/PumpInventorySectionFromApi.tsx
"use client";

import { useEffect, useState, useMemo } from "react";
import { Row } from "./Row";
import { TwoDecInput } from "./TwoDecInput";
import EmpoyeeNumberField from "./EmployeeNumberField";
export type PumpInventoryData = {
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

export type PumpInventoryComputedPayload = {
  pump_id: string;
  location: string;
  date: string;
  price_per_liter: number;
  inputs_liters: { calibration: number; po: number; cash: number };
  computed: {
    beginning_inventory_liters: number;
    ending_inventory_liters: number;
    starting_liter_meter: number;
    ending_liter_meter: number;
    amounts_php: { calibration: number; po: number; cash: number };
  };
  cashier_employee_number?: string;           // NEW
  pump_attendant_employee_number?: string;    // NEW
};

const toNum = (v: unknown) =>
  typeof v === "number" ? (isFinite(v) ? v : 0)
  : typeof v === "string" ? (isFinite(Number(v.replace(/,/g, ""))) ? Number(v.replace(/,/g, "")) : 0)
  : 0;

const fmt2 = (v: unknown) => toNum(v).toFixed(2);
const peso = (n: number) => new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(n || 0);

function fmtDate(s?: string) {
  if (!s) return "";
  const d = new Date(s.replace(" ", "T") + (s.endsWith("Z") ? "" : "Z"));
  const mo = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][d.getUTCMonth()];
  const day = String(d.getUTCDate()).padStart(2, "0");
  const yr = d.getUTCFullYear();
  return `${mo} ${day}, ${yr}`;
}

export default function PumpInventorySectionFromApi({
  apiUrl = "/api/pump-inventories/get-by-pump-id-and-location?location=loboc&pump_id=7",
  onComputed,
}: {
  apiUrl?: string;
  onComputed?: (p: PumpInventoryComputedPayload | null) => void;
}) {
  const [data, setData] = useState<PumpInventoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [calibration, setCalibration] = useState("0.00");
  const [po, setPo] = useState("0.00");
  const [cash, setCash] = useState("0.00");
  const [cashierEmp, setCashierEmp] = useState("");
  const [attendantEmp, setAttendantEmp] = useState("");

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setErr("");
    fetch(apiUrl, { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => {
        if (!alive) return;
        if (!j?.ok || !j?.data) throw new Error(j?.error || "Failed to load");
        const d = j.data as PumpInventoryData;
        setData(d);
        setCalibration(fmt2(d.calibration ?? "0"));
        setPo(fmt2(d.po ?? "0"));
        setCash(fmt2(d.cash ?? "0"));
      })
      .catch((e) => setErr(String(e?.message || e)))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [apiUrl]);

  const computed = useMemo<PumpInventoryComputedPayload | null>(() => {
    if (!data) return null;
    const price = toNum(data.price);
    const beginning = toNum(data.beginning_inventory);
    const startingMeter = toNum(data.starting_liter_meter);
    const calNum = toNum(calibration);
    const poNum = toNum(po);
    const cashNum = toNum(cash);

    const endingInventory = Math.max(0, beginning - calNum - poNum - cashNum);
    const endingMeter = startingMeter + calNum + poNum + cashNum;

    return {

      pump_id: data.pump_id,
      location: data.location,
      date: data.date,
      price_per_liter: price,

      calibration: Number(fmt2(calNum)),
      po: Number(fmt2(poNum)),
      cash: Number(fmt2(cashNum)),

      beginning_inventory_liters: Number(fmt2(beginning)),
      ending_inventory_liters: Number(fmt2(endingInventory)),
      starting_liter_meter: Number(fmt2(startingMeter)),
      ending_liter_meter: Number(fmt2(endingMeter)),
      amounts_php: {
      calibration: Number(fmt2(price * calNum)),
      po: Number(fmt2(price * poNum)),
      cash: Number(fmt2(price * cashNum)),
      cashier_employee_number: cashierEmp || undefined,
      pump_attendant_employee_number: attendantEmp || undefined,

      },
    };
  }, [data, calibration, po, cash]);

  useEffect(() => {
    onComputed?.(computed);
  }, [computed, onComputed]);

  if (loading) return <div className="text-sm text-muted-foreground">Loading pump inventory…</div>;
  if (err) return <div className="text-sm text-destructive">Error: {err}</div>;
  if (!data) return null;

  const price = toNum(data.price);
  const beginning = toNum(data.beginning_inventory);
  const startingMeter = toNum(data.starting_liter_meter);
  const calNum = toNum(calibration);
  const poNum = toNum(po);
  const cashNum = toNum(cash);

  const endingInventory = Math.max(0, beginning - calNum - poNum - cashNum);
  const endingMeter = startingMeter + calNum + poNum + cashNum;

  return (
    <section className="space-y-5">
{/* Top details */}
<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
  <Row label="Date">{fmtDate(data.date)}</Row>
  <Row label="Location">{data.location}</Row>
</div>

<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
  <Row label="Dispenser">{data.dispenser_name}</Row>
  <Row label="Pump">{data.pump_name}</Row>
</div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Row label="Price (₱/L)">{peso(price)}</Row>
        <Row label="Unit">{data.unit || "liter"}</Row>
        <Row label="Beginning Inventory (L)">{fmt2(beginning)}</Row>
        <Row label="Starting Liter Meter">{fmt2(startingMeter)}</Row>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="space-y-1">
          <div className="text-xs text-muted-foreground">Calibration (L)</div>
          <TwoDecInput value={calibration} onChange={setCalibration} />
          <div className="text-xs text-muted-foreground">≈ {peso(price * calNum)}</div>
        </div>
        <div className="space-y-1">
          <div className="text-xs text-muted-foreground">PO (L)</div>
          <TwoDecInput value={po} onChange={setPo} />
          <div className="text-xs text-muted-foreground">≈ {peso(price * poNum)}</div>
        </div>
        <div className="space-y-1">
          <div className="text-xs text-muted-foreground">Cash (L)</div>
          <TwoDecInput value={cash} onChange={setCash} />
          <div className="text-xs text-muted-foreground">≈ {peso(price * cashNum)}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Row label="Ending Inventory (L)">{fmt2(endingInventory)}</Row>
        <Row label="Ending Liter Meter">{fmt2(endingMeter)}</Row>
      </div>
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
  <EmpoyeeNumberField
    label="Cashier Employee Number"
    value={cashierEmp}
    onChange={setCashierEmp}
    placeholder="12345"
  />
  <EmpoyeeNumberField
    label="Pump Attendant Employee Number"
    value={attendantEmp}
    onChange={setAttendantEmp}
    placeholder="67890"
  />
</div>
    </section>
  );
}
