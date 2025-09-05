"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

type POForm = {
  id: string;
  fuel_dispenser: string;
  product: string;
  po_number: string;
  plate_number: string;
  route: string;
  driver: string;
};

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

  const set = (k: keyof POForm, v: string) => setForm(prev => ({ ...prev, [k]: v }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submit PO:", form);
  };

  return (
    <main className="p-4 max-w-md mx-auto">
      <h2 className="text-lg font-semibold mb-3">Dispenser {dispenserId}</h2>
      <form onSubmit={onSubmit} className="space-y-3">
        <div className="grid gap-1">
          <Label htmlFor="po_number">PO Number</Label>
          <Input id="po_number" value={form.po_number} onChange={e => set("po_number", e.target.value)} placeholder="e.g. PO-2025-001" required />
        </div>

        <div className="grid gap-1">
          <Label htmlFor="plate_number">Plate Number</Label>
          <Input id="plate_number" value={form.plate_number} onChange={e => set("plate_number", e.target.value)} placeholder="e.g. ABC-1234" />
        </div>

        <div className="grid gap-1">
          <Label htmlFor="route">Route</Label>
          <Input id="route" value={form.route} onChange={e => set("route", e.target.value)} placeholder="e.g. Tagbilaran → Loboc" />
        </div>

        <div className="grid gap-1">
          <Label htmlFor="driver">Driver</Label>
          <Input id="driver" value={form.driver} onChange={e => set("driver", e.target.value)} placeholder="Driver name" />
        </div>

        <div className="grid gap-1">
          <Label>Product</Label>
          <Select value={form.product} onValueChange={v => set("product", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select product" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Diesel">Diesel</SelectItem>
              <SelectItem value="Regular">Regular</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-1">
          <Label htmlFor="fuel_dispenser">Fuel Dispenser</Label>
          <Input id="fuel_dispenser" value={form.fuel_dispenser} onChange={e => set("fuel_dispenser", e.target.value)} />
        </div>

        <Button type="submit" className="w-full">Save Purchase Order</Button>
      </form>
    </main>
  );
}
