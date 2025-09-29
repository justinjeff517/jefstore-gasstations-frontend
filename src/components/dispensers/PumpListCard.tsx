// src/components/dispensers/PumpListCard.tsx
"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { fmtDatePH, fmtLiters, fmtPrice, Dispenser } from "./format";

type Props = { dispenser: Dispenser; linkBase?: "dispensers" | "pumps" };

export default function PumpListCard({ dispenser, linkBase = "dispensers" }: Props) {
  return (
    <Card className="rounded-2xl border border-border/60 shadow-sm transition hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{dispenser.name}</CardTitle>
          <Badge variant="outline" className="rounded-md text-[11px]">ID: {dispenser.id}</Badge>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">Select a pump</p>
      </CardHeader>

      <CardContent className="pt-0">
        {dispenser.pumps?.length ? (
          <ul className="flex flex-col gap-2">
            {dispenser.pumps.map((p) => {
              const inv = p.latest_inventory;
              const labelName = inv?.pump_name || inv?.product || p.name;
              const price = fmtPrice(inv?.price);
              const stock = fmtLiters(inv?.ending_inventory);
              const date = fmtDatePH(inv?.date);
              const href = `/${linkBase}/${String(p.id)}`;

              return (
                <li key={p.id}>
                  <Button
                    asChild
                    variant="secondary"
                    className="group h-16 w-full justify-between rounded-2xl border bg-card/50 px-4 text-base"
                    aria-label={`Open ${labelName} on ${dispenser.name}`}
                    role="link"
                  >
                    <Link href={href}>
                      <div className="min-w-0 flex-1 text-left">
                        <div className="flex items-center gap-2">
                          <span className="truncate font-semibold text-base leading-tight">
                            {labelName}
                          </span>
                          {inv?.product && (
                            <Badge variant="secondary" className="h-5 rounded-md px-2 text-[11px]">
                              {inv.product}
                            </Badge>
                          )}
                        </div>

                        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] leading-snug text-muted-foreground">
                          <span className="tabular-nums">{price}</span>
                          <span>•</span>
                          <span className="tabular-nums">{stock}</span>
                          {date && (
                            <>
                              <span>•</span>
                              <span className="truncate">{date}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <ArrowRight className="ml-3 h-5 w-5 shrink-0 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </Button>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="rounded-xl border border-dashed p-4 text-center text-sm text-muted-foreground">
            No pumps available
          </div>
        )}
      </CardContent>
    </Card>
  );
}
