"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const schema = z.object({
  pump_name: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  product: z.string().min(1),
  price: z.number().min(0),
  beginning_liters: z.number().min(0),
  calibration_liters: z.literal(30),
  epo_liters: z.number().min(0),
  po_liters: z.number().min(0),
  cash_liters: z.number().min(0),
  ending_liters: z.number().min(0),
  liter_meter: z.number().min(0),
});
type FormData = z.infer<typeof schema>;

const n = (v) => {
  const num = typeof v === "number" ? v : parseFloat(String(v ?? ""));
  return Number.isFinite(num) ? num : 0;
};

export default function Page() {
  const router = useRouter();
  const { dispenser_name, pump_name } = useParams();
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      pump_name: String(pump_name ?? ""),
      date: today,
      product: "Diesel",
      price: 0,
      beginning_liters: 0,
      calibration_liters: 30,
      epo_liters: 0,
      po_liters: 0,
      cash_liters: 0,
      ending_liters: 0,
      liter_meter: 0,
    },
  });

  const beginning = n(watch("beginning_liters"));
  const epo = n(watch("epo_liters"));
  const po = n(watch("po_liters"));
  const cash = n(watch("cash_liters"));
  const calib = 30;

  const totalDispensed = calib + epo + po + cash;
  const ending = Math.max(0, beginning - totalDispensed);
  const meter = totalDispensed;

  async function onSubmit(data) {
    setValue("ending_liters", ending, { shouldValidate: true, shouldDirty: true });
    setValue("liter_meter", meter, { shouldValidate: true, shouldDirty: true });

    const res = await fetch(`/api/dispensers/${dispenser_name}/${pump_name}/inventory`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        dispenser_name,
        ...data,
        calibration_liters: calib,
        ending_liters: ending,
        liter_meter: meter,
      }),
    });
    if (res.ok) {
      alert("Inventory saved");
      router.back();
    } else {
      alert(`Save failed: ${await res.text()}`);
    }
  }

  return (
    <main className="mx-auto w-full max-w-md p-4">
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">
            Create Inventory for {String(dispenser_name)} — {String(pump_name)}
          </CardTitle>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-3">
            <div className="space-y-1">
              <Label>Pump</Label>
              <Input {...register("pump_name")} readOnly className="bg-muted/50" />
            </div>

            <div className="space-y-1">
              <Label>Date</Label>
              <Input type="date" {...register("date")} readOnly className="bg-muted/50" />
            </div>

            <div className="space-y-1">
              <Label>Product</Label>
              <Input {...register("product")} readOnly className="bg-muted/50" />
            </div>

            <div className="space-y-1">
              <Label>Price (₱/L)</Label>
              <Input type="number" step="0.01" inputMode="decimal" readOnly className="bg-muted/50" {...register("price", { valueAsNumber: true })} />
            </div>

            <div className="space-y-1">
              <Label>Beginning Liters</Label>
              <Input type="number" step="0.001" inputMode="decimal" readOnly className="bg-muted/50" {...register("beginning_liters", { valueAsNumber: true })} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Calibration (L)</Label>
                <div className="h-10 rounded-md border border-input bg-muted/50 px-3 flex items-center text-sm">30</div>
                <input type="hidden" {...register("calibration_liters", { valueAsNumber: true })} value={30} readOnly />
              </div>
              <div className="space-y-1">
                <Label>EPO (L)</Label>
                <Input type="number" step="0.001" inputMode="decimal" {...register("epo_liters", { valueAsNumber: true })} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>PO (L)</Label>
                <Input type="number" step="0.001" inputMode="decimal" {...register("po_liters", { valueAsNumber: true })} />
              </div>
              <div className="space-y-1">
                <Label>Cash (L)</Label>
                <Input type="number" step="0.001" inputMode="decimal" {...register("cash_liters", { valueAsNumber: true })} />
              </div>
            </div>

            <div className="rounded-md bg-muted p-3 text-sm">
              <div className="flex items-center justify-between">
                <span>Total Dispensed (L)</span>
                <span className="font-medium">{totalDispensed.toFixed(3)}</span>
              </div>
              <div className="mt-1 flex items-center justify-between">
                <span>Ending Liters (auto)</span>
                <span className="font-medium">{ending.toFixed(3)}</span>
              </div>
              <div className="mt-1 flex items-center justify-between">
                <span>Liter Meter (auto)</span>
                <span className="font-medium">{meter.toFixed(3)}</span>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex-col gap-3">
            <Input type="hidden" {...register("ending_liters", { valueAsNumber: true })} value={ending} readOnly />
            <Input type="hidden" {...register("liter_meter", { valueAsNumber: true })} value={meter} readOnly />
            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Inventory"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}
