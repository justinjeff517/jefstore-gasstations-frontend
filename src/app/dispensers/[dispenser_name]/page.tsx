"use client";

import { useParams, useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// ...your SAMPLE_PUMPS / SAMPLE_REPORT...

export default function Page() {
  const { dispenser_name } = useParams();
  const router = useRouter();
  const dn = Array.isArray(dispenser_name) ? dispenser_name[0] : dispenser_name;



  const SAMPLE_PUMPS = [
  { id: "1", name: "diesel", product: "Diesel", fuel_dispenser_name: "east" },
  { id: "2", name: "regular", product: "Regular", fuel_dispenser_name: "east" },
  { id: "3", name: "diesel", product: "Diesel", fuel_dispenser_name: "west" },
  { id: "4", name: "regular", product: "Regular", fuel_dispenser_name: "west" },
];

const SAMPLE_REPORT = {
  date: "2025-09-16",
  price: 58.75, // ₱/L
  beginning_liters: 1200,
  calibration_liters: 5,
  epo_liters: 20,
  po_liters: 50,
  cash_liters: 200,
  ending_liters: 925,
  liter_meter: 1500,
};


  const todayHuman = new Intl.DateTimeFormat("en-PH", { dateStyle: "full" }).format(new Date());
  const pumps = SAMPLE_PUMPS.filter((p) => p.fuel_dispenser_name === dn);
  if (pumps.length === 0) return <div className="p-4">Not found</div>;

  return (
    <div className="mx-auto w-full max-w-screen-sm sm:max-w-screen-md md:max-w-screen-lg p-4 space-y-4">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-2">
        <h1 className="text-lg sm:text-xl font-semibold capitalize">Dispenser: {dn}</h1>
        <p className="text-xs sm:text-sm text-muted-foreground">{todayHuman}</p>
      </header>

      <div className="space-y-4">
        {pumps.map((pump) => (
          <Card key={pump.id} className="w-full shadow hover:shadow-md transition">
            <CardHeader className="pb-2">
              <CardTitle className="text-base sm:text-lg capitalize">
                {pump.name} Pump • {pump.product}
              </CardTitle>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {SAMPLE_REPORT.date} • {pump.product} @ ₱{SAMPLE_REPORT.price.toFixed(2)}/L
              </p>
            </CardHeader>

            <CardContent className="text-sm sm:text-base">
              <div className="divide-y">
                <Row label="ID" value={pump.id} />
                <Row label="Beginning Liters" value={SAMPLE_REPORT.beginning_liters} unit="[L]" />
                <Row label="Calibration" value={SAMPLE_REPORT.calibration_liters} unit="[L]" />
                <Row label="EPO Liters" value={SAMPLE_REPORT.epo_liters} unit="[L]" />
                <Row label="PO Liters" value={SAMPLE_REPORT.po_liters} unit="[L]" />
                <Row label="Cash Liters" value={SAMPLE_REPORT.cash_liters} unit="[L]" />
                <Row label="Ending Liters" value={SAMPLE_REPORT.ending_liters} unit="[L]" />
                <Row label="Liter Meter" value={SAMPLE_REPORT.liter_meter} unit="[L]" bold />
                <Row label="Price" value={`₱${SAMPLE_REPORT.price.toFixed(2)}`} unit="[/L]" />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col items-center space-y-2">
              <Button
                className="w-full h-12 text-base"
                onClick={() => router.push(`/dispensers/${dn}/create`)}
                aria-label={`Create ${pump.product} report for ${dn} dispenser`}
              >
                Create
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                {dn} dispenser – {pump.name} pump inventory
              </p>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}


// Row component unchanged...



function Row({
  label,
  value,
  unit,
  bold,
}: {
  label: string;
  value: string | number;
  unit?: string;
  bold?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <span>
        {label} {unit && <span className="text-xs text-muted-foreground">{unit}</span>}
      </span>
      <span className={bold ? "font-medium" : ""}>{value}</span>
    </div>
  );
}
