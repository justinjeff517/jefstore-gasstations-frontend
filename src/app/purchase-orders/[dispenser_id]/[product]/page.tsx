"use client";

import { useParams } from "next/navigation";
import ModePicker from "@/components/purchase-orders/ModePicker";

export default function DispenserIndexPage() {
  const params = useParams();
  const dispenserId = String(params.dispenser_id ?? "");

  return (
    <main className="p-4 max-w-md mx-auto">
      <h2 className="text-lg font-semibold mb-3">Dispenser {dispenserId}</h2>
      <ModePicker dispenserId={dispenserId} baseNozzle="regular" />
    </main>
  );
}
