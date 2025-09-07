"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import PONumber from "@/components/purchase-orders/PONumber";
import PlateNumber from "@/components/purchase-orders/PlateNumber";
import RouteField from "@/components/purchase-orders/RouteField";
import DriverField from "@/components/purchase-orders/DriverField";
import ModePicker from "@/components/purchase-orders/ModePicker";
import AutoScanWait from "@/components/purchase-orders/AutoScanWait";

type POForm = {
  id: string;
  fuel_dispenser: string;
  product: string;
  po_number: string;
  plate_number: string;
  route: string;
  driver: string;
};

const REQUIRED: (keyof POForm)[] = ["fuel_dispenser", "product", "po_number", "plate_number", "route", "driver"];

function parseNozzle(v: string | null): { base: string; mode: "auto" | "manual" | null } {
  const raw = String(v ?? "").trim();
  const [head, tail] = raw.split("/");
  const base = head || "";
  const mode = tail === "auto" || tail === "manual" ? (tail as "auto" | "manual") : null;
  return { base, mode };
}

export default function DispenserPurchaseOrdersPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const dispenserId = String(params.dispenser_id ?? "");
  const { base: baseNozzle, mode } = useMemo(() => parseNozzle(searchParams.get("nozzle")), [searchParams]);

  const [form, setForm] = useState<POForm>({
    id: crypto.randomUUID(),
    fuel_dispenser: dispenserId,
    product: baseNozzle || "",
    po_number: "",
    plate_number: "",
    route: "",
    driver: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof POForm, string>>>({});

  useEffect(() => {
    const prefillRaw = sessionStorage.getItem("po.prefill");
    if (prefillRaw) {
      try {
        const p = JSON.parse(prefillRaw);
        setForm(prev => ({
          ...prev,
          po_number: p.po_number ?? prev.po_number,
          plate_number: p.plate_number ?? prev.plate_number,
          route: p.route ?? prev.route,
          driver: p.driver ?? prev.driver,
        }));
      } catch {}
      sessionStorage.removeItem("po.prefill");
    }
  }, []);

  useEffect(() => {
    setForm({
      id: crypto.randomUUID(),
      fuel_dispenser: dispenserId,
      product: baseNozzle || "",
      po_number: "",
      plate_number: "",
      route: "",
      driver: "",
    });
    setErrors({});
  }, [dispenserId, baseNozzle]);

  const set = (k: keyof POForm, v: string) => {
    setForm(prev => ({ ...prev, [k]: v }));
    setErrors(prev => ({ ...prev, [k]: undefined }));
  };

  const validate = (data: POForm) => {
    const e: Partial<Record<keyof POForm, string>> = {};
    for (const k of REQUIRED) if (!String(data[k] ?? "").trim()) e[k] = "Required";
    return e;
  };

  const isComplete = useMemo(() => REQUIRED.every(k => String(form[k]).trim() !== ""), [form]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const eMap = validate(form);
    setErrors(eMap);
    if (Object.keys(eMap).length) return;
    console.log("Submit PO:", form);
  };

  if (!baseNozzle || (mode !== "auto" && mode !== "manual")) {
    return (
      <main className="p-4 max-w-md mx-auto">
        <h2 className="text-lg font-semibold mb-3">Dispenser {dispenserId}</h2>
        <ModePicker dispenserId={dispenserId} baseNozzle={baseNozzle || "regular"} />
      </main>
    );
  }

  if (mode === "auto") {
    const manualHref = `/purchase-orders/${dispenserId}?nozzle=${baseNozzle}/manual`;
    const backHref = `/purchase-orders/${dispenserId}?nozzle=${baseNozzle}`;
    return (
      <main className="p-4 max-w-md mx-auto">
        <AutoScanWait dispenserId={dispenserId} baseNozzle={baseNozzle} manualHref={manualHref} backHref={backHref} />
      </main>
    );
  }

  return (
    <main className="p-4 max-w-md mx-auto">
      <h2 className="text-lg font-semibold mb-3">Dispenser {dispenserId}</h2>
      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <PONumber value={form.po_number} onChange={v => set("po_number", v)} required />
          {errors.po_number && <p className="mt-1 text-xs text-red-600" id="err-po">{errors.po_number}</p>}
        </div>
        <div>
          <PlateNumber value={form.plate_number} onChange={v => set("plate_number", v)} />
          {errors.plate_number && <p className="mt-1 text-xs text-red-600" id="err-plate">{errors.plate_number}</p>}
        </div>
        <div>
          <RouteField value={form.route} onChange={v => set("route", v)} />
          {errors.route && <p className="mt-1 text-xs text-red-600" id="err-route">{errors.route}</p>}
        </div>
        <div>
          <DriverField value={form.driver} onChange={v => set("driver", v)} />
          {errors.driver && <p className="mt-1 text-xs text-red-600" id="err-driver">{errors.driver}</p>}
        </div>
        <div className="grid gap-1">
          <Label>Product</Label>
          <Select value={form.product} onValueChange={v => set("product", v)}>
            <SelectTrigger className={errors.product ? "border-red-500" : undefined} aria-invalid={!!errors.product} aria-describedby={errors.product ? "err-product" : undefined}>
              <SelectValue placeholder="Select product" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="diesel">Diesel</SelectItem>
              <SelectItem value="regular">Regular</SelectItem>
            </SelectContent>
          </Select>
          {errors.product && <p className="mt-1 text-xs text-red-600" id="err-product">{errors.product}</p>}
        </div>
        <div className="grid gap-1">
          <Label htmlFor="fuel_dispenser">Fuel Dispenser</Label>
          <Input id="fuel_dispenser" value={form.fuel_dispenser} readOnly className={errors.fuel_dispenser ? "border-red-500" : undefined} aria-invalid={!!errors.fuel_dispenser} aria-describedby={errors.fuel_dispenser ? "err-fd" : undefined} />
          {errors.fuel_dispenser && <p className="mt-1 text-xs text-red-600" id="err-fd">{errors.fuel_dispenser}</p>}
        </div>
        <Button type="submit" className="w-full" disabled={!isComplete}>Save Purchase Order</Button>
      </form>
    </main>
  );
}
