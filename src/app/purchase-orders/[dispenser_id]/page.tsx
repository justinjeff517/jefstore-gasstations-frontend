"use client";

import { useMemo } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Keycap } from "@/components/Keycap";

type NozzleSpec = { id: "nozzle_1" | "nozzle_2"; product: "Diesel" | "Regular" };
type DispenserSpec = {
  dispenser_id: "dispenser_1" | "dispenser_2";
  location: "East" | "West";
  nozzles: NozzleSpec[];
};

const DISPENSERS: DispenserSpec[] = [
  { dispenser_id: "dispenser_1", location: "East", nozzles: [{ id: "nozzle_1", product: "Diesel" }, { id: "nozzle_2", product: "Regular" }] },
  { dispenser_id: "dispenser_2", location: "West", nozzles: [{ id: "nozzle_1", product: "Diesel" }, { id: "nozzle_2", product: "Regular" }] },
];

export default function DispenserPurchaseOrdersPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const dispenserId = String(params.dispenser_id) as DispenserSpec["dispenser_id"] | string;
  const nozzleParam = (searchParams.get("nozzle") || "nozzle_1") as NozzleSpec["id"];

  const selected = useMemo(() => {
    const d = DISPENSERS.find(x => x.dispenser_id === dispenserId as any);
    const n = d?.nozzles.find(z => z.id === nozzleParam);
    return { d, n };
  }, [dispenserId, nozzleParam]);

  const title = selected.d && selected.n ? `${selected.d.location} — ${selected.n.product}` : "Unknown Pump";

  function setNozzle(id: NozzleSpec["id"]) {
    router.replace(`/purchase-orders/${dispenserId}?nozzle=${id}`);
  }

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-2xl px-4">
          <div className="h-12 flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => router.push("/purchase-orders")}>Back</Button>
            <div className="text-sm font-semibold truncate">{title}</div>
            <div className="ml-auto text-[11px] text-muted-foreground flex items-center gap-2">
              <span className="hidden sm:inline">Nozzle:</span>
              <Button size="xs" variant={nozzleParam === "nozzle_1" ? "default" : "outline"} onClick={() => setNozzle("nozzle_1")}>Nozzle 1</Button>
              <Button size="xs" variant={nozzleParam === "nozzle_2" ? "default" : "outline"} onClick={() => setNozzle("nozzle_2")}>Nozzle 2</Button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 pt-14 pb-4 space-y-3">
        {!selected.d ? (
          <p className="text-sm text-destructive">Invalid dispenser: {dispenserId}</p>
        ) : (
          <section className="space-y-3">
            <article className="rounded-lg border p-3">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">Selected</div>
              <div className="text-sm font-medium">{title}</div>
              <div className="text-[11px] text-muted-foreground">id: {selected.d.dispenser_id} · {nozzleParam.replace("nozzle_", "Nozzle ")}</div>
            </article>

            <article className="rounded-lg border p-3">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">Actions</div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Button onClick={() => router.push(`/purchase-orders`)}>View All POs</Button>
                <Button variant="outline" onClick={() => router.push(`/purchase-orders/${dispenserId}?nozzle=${nozzleParam}`)}>
                  Refresh
                </Button>
              </div>
              <div className="mt-3 text-xs text-muted-foreground flex items-center gap-2">
                <Keycap label="URL" />
                <span>/purchase-orders/{dispenserId}?nozzle={nozzleParam}</span>
              </div>
            </article>
          </section>
        )}
      </main>
    </>
  );
}
