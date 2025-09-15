"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const SAMPLE_PUMPS = [
  { id: "1", name: "diesel", product: "Diesel", fuel_dispenser_name: "east" },
  { id: "2", name: "regular", product: "Regular", fuel_dispenser_name: "east" },
  { id: "3", name: "diesel", product: "Diesel", fuel_dispenser_name: "west" },
  { id: "4", name: "regular", product: "Regular", fuel_dispenser_name: "west" },
];

export default function Page() {
  const { dispenser_name } = useParams();

  const pumps = SAMPLE_PUMPS.filter(
    (p) => p.fuel_dispenser_name === dispenser_name
  );

  if (pumps.length === 0) {
    return <div className="p-4">Not found</div>;
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-semibold capitalize">
        Dispenser: {dispenser_name}
      </h1>
      <div className="grid gap-4 sm:grid-cols-2">
        {pumps.map((pump) => (
          <Link
            key={pump.id}
            href={`/dispensers/${pump.fuel_dispenser_name}/${pump.name}`}
          >
            <Card className="hover:shadow-md transition cursor-pointer">
              <CardHeader>
                <CardTitle className="capitalize">{pump.name} pump</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Product: {pump.product}</p>
                <p>ID: {pump.id}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
