"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Fuel, ArrowRight } from "lucide-react";

type LatestInventory = {
  price?: string;                 // "62.50"
  ending_inventory?: string;      // "5000.00"
  date?: string;                  // "2025-09-27T16:00:00Z"
  pump_name?: string;
  product?: string;
};

type Pump = { id: number; name: string; latest_inventory?: LatestInventory };
type Dispenser = { id: string; name: string; location: string; pumps: Pump[] };

export default function Page() {
  const { data: session } = useSession();
  const location = session?.user?.location ?? "";
  const [dispensers, setDispensers] = useState<Dispenser[]>([]);
  const [loading, setLoading] = useState(false);

  const fmtPrice = (s?: string) =>
    s ? `₱${Number(s).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/L` : "₱0.00/L";

  const fmtLiters = (s?: string) =>
    s ? `${Number(s).toLocaleString("en-PH", { maximumFractionDigits: 2 })} L` : "0 L";

  const fmtDatePH = (iso?: string) => {
    if (!iso) return "";
    try {
      return new Intl.DateTimeFormat("en-PH", {
        timeZone: "Asia/Manila",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date(iso));
    } catch {
      return "";
    }
  };

  const endpoint = useMemo(() => {
    if (!location) return "";
    const q = encodeURIComponent(location);
    return `/api/pumps/get-latest-pump-inventories-by-location?location=${q}`;
  }, [location]);

  useEffect(() => {
    if (!endpoint) return;
    setLoading(true);
    fetch(endpoint)
      .then((res) => res.json())
      .then((data: unknown) => {
        setDispensers(Array.isArray(data) ? (data as Dispenser[]) : []);
      })
      .catch((err) => console.error("Failed to load latest inventories", err))
      .finally(() => setLoading(false));
  }, [endpoint]);

  return (
    <main className="mx-auto w-full max-w-md p-4">
      <header className="mb-5 flex items-center gap-2">
        <div className="rounded-lg bg-primary/10 p-2">
          <Fuel className="h-5 w-5 text-primary" aria-hidden />
        </div>
        <h1 className="text-xl font-semibold tracking-tight">
          Dispensers — {location || "Unknown"}
        </h1>
      </header>

      {loading && (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-muted/50" />
          ))}
        </div>
      )}

      {!loading && (
        <section className="grid grid-cols-1 gap-4">
          {dispensers.map((d) => (
            <Card
              key={d.id}
              className="rounded-2xl border border-border/60 shadow-sm transition hover:shadow-md"
            >
              <CardHeader className="pb-2">
                <div className="flex items-baseline justify-between">
                  <CardTitle className="text-base font-semibold">{d.name}</CardTitle>
                  <span className="text-xs text-muted-foreground">#{d.id}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">Select a pump</p>
              </CardHeader>

              <CardContent className="pt-0">
                {d.pumps?.length ? (
                  <div className="flex flex-col gap-2">
                    {d.pumps.map((p) => {
                      const inv = p.latest_inventory;
                      const labelName = inv?.pump_name || inv?.product || p.name;
                      const price = fmtPrice(inv?.price);
                      const stock = fmtLiters(inv?.ending_inventory);
                      const date = fmtDatePH(inv?.date);

                      return (
                        <Button
                          asChild
                          key={p.id}
                          variant="secondary"
                          className="group h-12 justify-between rounded-xl border bg-card/40 backdrop-blur-sm"
                          aria-label={`Open ${labelName} on ${d.name}`}
                        >
                          <Link href={`/dispensers/${p.id}`}>
                            <span className="truncate">
                              {labelName}
                              <span className="mx-2 text-muted-foreground">•</span>
                              {price}
                              <span className="mx-2 text-muted-foreground">•</span>
                              {stock}
                              {date && <span className="ml-2 text-muted-foreground">{date}</span>}
                            </span>
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                          </Link>
                        </Button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed p-4 text-center text-xs text-muted-foreground">
                    No pumps available
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </section>
      )}
    </main>
  );
}
