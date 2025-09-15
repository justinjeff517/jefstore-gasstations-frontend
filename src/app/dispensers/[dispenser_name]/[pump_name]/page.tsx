"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type PumpReport = {
  pump_name: string;
  date: string;
  product: string;
  price: number;
  beginning_liters: number;
  calibration_liters: number;
  epo_liters: number;
  po_liters: number;
  cash_liters: number;
  ending_liters: number;
  liter_meter: number;
};

// 🔹 Sample placeholder data
const SAMPLE: PumpReport = {
  pump_name: "Pump-1",
  date: "2025-09-16",
  product: "Diesel",
  price: 58.75,
  beginning_liters: 1200,
  calibration_liters: 5,
  epo_liters: 20,
  po_liters: 50,
  cash_liters: 200,
  ending_liters: 925,
  liter_meter: 1500,
};

export default function Page() {
  const { dispenser_name, pump_name } = useParams();
  const todayHuman = new Intl.DateTimeFormat("en-PH", { dateStyle: "full" }).format(new Date());

  return (
    <div className="flex justify-center items-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <p className="text-xs text-muted-foreground">{todayHuman}</p>
          <CardTitle className="text-xl font-semibold">
            Dispenser: {dispenser_name} | Pump: {pump_name}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {SAMPLE.date} • {SAMPLE.product} @ ₱{SAMPLE.price.toFixed(2)}/L
          </p>
        </CardHeader>

        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Beginning Liters:</span><span>{SAMPLE.beginning_liters}</span></div>
            <div className="flex justify-between"><span>Calibration:</span><span>{SAMPLE.calibration_liters}</span></div>
            <div className="flex justify-between"><span>EPO Liters:</span><span>{SAMPLE.epo_liters}</span></div>
            <div className="flex justify-between"><span>PO Liters:</span><span>{SAMPLE.po_liters}</span></div>
            <div className="flex justify-between"><span>Cash Liters:</span><span>{SAMPLE.cash_liters}</span></div>
            <div className="flex justify-between"><span>Ending Liters:</span><span>{SAMPLE.ending_liters}</span></div>
            <div className="flex justify-between font-medium"><span>Liter Meter:</span><span>{SAMPLE.liter_meter}</span></div>
          </div>
        </CardContent>

        <CardFooter>
          <Button asChild className="w-full">
            <Link href={`/dispensers/${dispenser_name}/${pump_name}/inventory/create`}>
              Create {dispenser_name} dispenser-{pump_name} pump Inventory
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
