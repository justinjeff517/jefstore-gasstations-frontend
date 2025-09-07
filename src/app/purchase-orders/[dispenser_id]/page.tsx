"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useState, useMemo } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import PONumber from "@/components/purchase-orders/PONumber";
import PlateNumber from "@/components/purchase-orders/PlateNumber";
import RouteField from "@/components/purchase-orders/RouteField";
import DriverField from "@/components/purchase-orders/DriverField";

type POForm = {
  id: string;
  fuel_dispenser: string;
  product: string;
  po_number: string;
  plate_number: string;
  route: string;
  driver: string;
};

const REQUIRED: (keyof POForm)[] = [
  "fuel_dispenser",
  "product",
  "po_number",
  "plate_number",
  "route",
  "driver",
];

export default function DispenserPurchaseOrdersPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const dispenserId = String(params.dispenser_id ?? "");
  const nozzle = String(searchParams.get("nozzle") ?? "");

  const [form, setForm] = useState<POForm>({
    id: crypto.randomUUID(),
    fuel_dispenser: dispenserId,
    product: nozzle || "",
    po_number: "",
    plate_number: "",
    route: "",
    driver: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof POForm, string>>>({});

  const set = (k: keyof POForm, v: string) => {
    setForm(prev => ({ ...prev, [k]: v }));
    setErrors(prev => ({ ...prev, [k]: undefined })); // clear field error as user types
  };

  const validate = (data: POForm) => {
    const e: Partial<Record<keyof POForm, string>> = {};
    for (const k of REQUIRED) {
      if (!String(data[k] ?? "").trim()) e[k] = "Required";
    }
    return e;
  };

  const isComplete = useMemo(
    () => REQUIRED.every(k => String(form[k]).trim() !== ""),
    [form]
  );

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const eMap = validate(form);
    setErrors(eMap);
    if (Object.keys(eMap).length) return; // block submit
    console.log("Submit PO:", form);
  };

  return (
    <main className="p-4 max-w-md mx-auto">
      <h2 className="text-lg font-semibold mb-3">Dispenser {dispenserId}</h2>
      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <PONumber value={form.po_number} onChange={v => set("po_number", v)} required />
          {errors.po_number && <p className="mt-1 text-xs text-red-600">{errors.po_number}</p>}
        </div>

        <div>
          <PlateNumber value={form.plate_number} onChange={v => set("plate_number", v)} />
          {errors.plate_number && <p className="mt-1 text-xs text-red-600">{errors.plate_number}</p>}
        </div>

        <div>
          <RouteField value={form.route} onChange={v => set("route", v)} />
          {errors.route && <p className="mt-1 text-xs text-red-600">{errors.route}</p>}
        </div>

        <div>
          <DriverField value={form.driver} onChange={v => set("driver", v)} />
          {errors.driver && <p className="mt-1 text-xs text-red-600">{errors.driver}</p>}
        </div>

        <div className="grid gap-1">
          <Label>Product</Label>
          <Select value={form.product} onValueChange={v => set("product", v)}>
            <SelectTrigger className={errors.product ? "border-red-500" : undefined}>
              <SelectValue placeholder="Select product" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Diesel">Diesel</SelectItem>
              <SelectItem value="Regular">Regular</SelectItem>
            </SelectContent>
          </Select>
          {errors.product && <p className="mt-1 text-xs text-red-600">{errors.product}</p>}
        </div>

        <div className="grid gap-1">
          <Label htmlFor="fuel_dispenser">Fuel Dispenser</Label>
          <Input
            id="fuel_dispenser"
            value={form.fuel_dispenser}
            onChange={e => set("fuel_dispenser", e.target.value)}
            className={errors.fuel_dispenser ? "border-red-500" : undefined}
          />
          {errors.fuel_dispenser && <p className="mt-1 text-xs text-red-600">{errors.fuel_dispenser}</p>}
        </div>

        <Button type="submit" className="w-full" disabled={!isComplete}>
          Save Purchase Order
        </Button>
      </form>
    </main>
  );
}
