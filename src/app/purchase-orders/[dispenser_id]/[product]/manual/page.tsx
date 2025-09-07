"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useId } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import PONumber from "@/components/purchase-orders/PONumber";
import PlateNumber from "@/components/purchase-orders/PlateNumber";
import RouteField from "@/components/purchase-orders/RouteField";
import DriverField from "@/components/purchase-orders/DriverField";
import QuantityField from "@/components/purchase-orders/QuantityField";

type POForm = {
  id: string;
  product: string;
  po_number: string;
  plate_number: string;
  route: string;
  driver: string;
  quantity_liters: string;
};

const REQUIRED: (keyof POForm)[] = [
  "product",
  "po_number",
  "plate_number",
  "route",
  "driver",
  "quantity_liters",
];

export default function DispenserManualPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const productLabelId = useId();

  const dispenserId = String(params.dispenser_id ?? "");
  const nozzleParam = String(searchParams.get("nozzle") ?? "regular");
  const productFromNozzle = useMemo(() => (nozzleParam.split("/")[0] || "regular"), [nozzleParam]);

  const [form, setForm] = useState<POForm>({
    id: crypto.randomUUID(),
    product: productFromNozzle,
    po_number: "",
    plate_number: "",
    route: "",
    driver: "",
    quantity_liters: "",
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
      product: productFromNozzle,
      po_number: "",
      plate_number: "",
      route: "",
      driver: "",
      quantity_liters: "",
    });
    setErrors({});
  }, [productFromNozzle, dispenserId]);

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

    sessionStorage.setItem("po.manual.pending", JSON.stringify({ ...form }));
    router.push(
      `/purchase-orders/${dispenserId}/manual/confirm?id=${encodeURIComponent(form.id)}`
    );
  };

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
          <Label htmlFor={productLabelId}>Product</Label>
          <Select value={form.product} onValueChange={v => set("product", v)}>
            <SelectTrigger
              id={productLabelId}
              className={errors.product ? "border-red-500" : undefined}
              aria-invalid={!!errors.product}
              aria-describedby={errors.product ? "err-product" : undefined}
            >
              <SelectValue placeholder="Select product" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="diesel">Diesel</SelectItem>
              <SelectItem value="regular">Regular</SelectItem>
            </SelectContent>
          </Select>
          {errors.product && <p className="mt-1 text-xs text-red-600" id="err-product">{errors.product}</p>}
        </div>

        <QuantityField
          value={form.quantity_liters}
          onChange={(v) => set("quantity_liters", v)}
          required
          error={errors.quantity_liters}
        />

        <Button type="submit" className="w-full" disabled={!isComplete}>
          Save Purchase Order
        </Button>
      </form>
    </main>
  );
}
