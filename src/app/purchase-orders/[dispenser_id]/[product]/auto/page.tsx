"use client";

import { useParams, useSearchParams } from "next/navigation";
import AutoScanWait from "@/components/purchase-orders/AutoScanWait";

export default function DispenserAutoPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const dispenserId = String(params.dispenser_id ?? "");
  const baseNozzle = String(searchParams.get("nozzle") ?? "regular");

  const manualHref = `/purchase-orders/${dispenserId}/manual?nozzle=${baseNozzle}`;
  const backHref = `/purchase-orders/${dispenserId}?nozzle=${baseNozzle}`;

  return (
    <main className="p-4 max-w-md mx-auto">
      <AutoScanWait
        dispenserId={dispenserId}
        baseNozzle={baseNozzle}
        manualHref={manualHref}
        backHref={backHref}
      />
    </main>
  );
}
