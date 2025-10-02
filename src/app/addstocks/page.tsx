// app/addstocks/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

type EJSONDate = { $date: string };
type EJSONOid = { $oid: string };

type AddStockItem = {
  product: "diesel" | "regular" | string;
  quantity: number;
};

type AddStock = {
  _id?: EJSONOid;
  id: string;
  date: EJSONDate;
  items: AddStockItem[];
  creator_employee_number: string;
  created: string | EJSONDate;
};

type ApiResp = {
  ok: boolean;
  count: number;
  items: AddStock[];
  error?: string;
};

function asISO(d: string | EJSONDate | undefined) {
  if (!d) return "";
  if (typeof d === "string") return d;
  return d.$date;
}

function fmtDate(d: string | EJSONDate) {
  const s = asISO(d);
  if (!s) return "—";
  return new Date(s).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

/* ---------- Humanize helpers ---------- */
function startOfLocalDay(dt: Date) {
  const out = new Date(dt);
  out.setHours(0, 0, 0, 0);
  return out;
}

const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

function humanizeDate(d: string | EJSONDate) {
  const iso = asISO(d);
  if (!iso) return "—";
  const when = new Date(iso);
  const now = new Date();

  // Compare by calendar days (local)
  const dayMs = 24 * 60 * 60 * 1000;
  const diffDays = Math.round(
    (startOfLocalDay(when).getTime() - startOfLocalDay(now).getTime()) / dayMs
  );

  // If within ~1 month, use days; beyond that, use months/years
  if (Math.abs(diffDays) <= 31) return rtf.format(diffDays, "day");

  const diffMonths =
    (now.getFullYear() - when.getFullYear()) * 12 +
    (now.getMonth() - when.getMonth());

  if (Math.abs(diffMonths) <= 24) return rtf.format(-diffMonths, "month");

  const diffYears = now.getFullYear() - when.getFullYear();
  return rtf.format(-diffYears, "year");
}

function ProductBadge({ p }: { p: AddStockItem }) {
  const map: Record<string, "destructive" | "secondary" | "outline"> = {
    diesel: "destructive",
    regular: "secondary",
  };
  const variant = map[p.product] ?? "outline";
  return (
    <Badge variant={variant} className="text-sm px-2 py-1">
      {p.product}: {p.quantity.toLocaleString()} L
    </Badge>
  );
}

export default function Page() {
  const [data, setData] = useState<AddStock[] | null>(null);
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [err, setErr] = useState<string | null>(null);
  const router = useRouter();

  async function load() {
    try {
      setLoading(true);
      setErr(null);
      const r = await fetch("/api/addstocks/get-all", { cache: "no-store" });
      const j: ApiResp = await r.json();
      if (!r.ok || !j.ok) {
        throw new Error(j?.error || `HTTP ${r.status}`);
      }
      const items = [...(j.items || [])].sort(
        (a, b) => new Date(asISO(b.date)).getTime() - new Date(asISO(a.date)).getTime()
      );
      setData(items);
      setCount(j.count || items.length);
    } catch (e: any) {
      setErr(e.message || "Failed to load");
      setData(null);
      setCount(0);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const totalDiesel = useMemo(
    () =>
      (data || []).reduce((sum, d) => {
        const item = d.items.find((i) => i.product === "diesel");
        return sum + (item?.quantity || 0);
      }, 0),
    [data]
  );

  const totalRegular = useMemo(
    () =>
      (data || []).reduce((sum, d) => {
        const item = d.items.find((i) => i.product === "regular");
        return sum + (item?.quantity || 0);
      }, 0),
    [data]
  );

  return (
    <main className="mx-auto w-full max-w-xl px-3 py-5 sm:max-w-2xl">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between gap-2">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Add Stocks</h1>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => router.refresh()}>
            Refresh
          </Button>
          <Button size="sm" onClick={load}>
            Reload
          </Button>
        </div>
      </div>

      {/* Summary */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <Badge className="text-sm px-2 py-1">Records: {loading ? "…" : count}</Badge>
        <Badge variant="destructive" className="text-sm px-2 py-1">
          Diesel total: {loading ? "…" : totalDiesel.toLocaleString()} L
        </Badge>
        <Badge variant="secondary" className="text-sm px-2 py-1">
          Regular total: {loading ? "…" : totalRegular.toLocaleString()} L
        </Badge>
      </div>

      {/* Error */}
      {err && (
        <Card className="mb-4 border-red-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-base sm:text-lg text-red-600">Failed to load</CardTitle>
          </CardHeader>
          <CardContent className="text-base">
            <p className="text-muted-foreground">{err}</p>
            <div className="mt-3">
              <Button size="sm" onClick={load}>
                Try again
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading skeletons */}
      {loading && !data && (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-5 w-20" />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-6 w-28" />
                </div>
                <Skeleton className="h-4 w-48" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* List */}
      {!loading && data && (
        <div className="space-y-4">
          {data.map((row) => (
            <Card key={row.id} className="rounded-2xl">
              <CardHeader className="pb-1">
                <div className="flex items-baseline justify-between">
                  <CardTitle className="text-xl sm:text-2xl">
                    {fmtDate(row.date)}
                  </CardTitle>
                  <Badge variant="outline" className="text-sm">
                    #{row.id?.slice(0, 8) || "—"}
                  </Badge>
                </div>
                <div className="mt-1 text-sm sm:text-base text-muted-foreground">
                  {humanizeDate(row.date)}
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-base">
                <div className="flex flex-wrap gap-2">
                  {row.items.map((p, i) => (
                    <ProductBadge key={`${row.id}:${p.product}:${i}`} p={p} />
                  ))}
                </div>
                <Separator className="my-1" />
                <div className="flex items-center justify-between text-sm sm:text-base text-muted-foreground">
                  <span>Creator Emp#: {row.creator_employee_number}</span>
                  <span>Created: {fmtDate(row.created as any)} • {humanizeDate(row.created as any)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
          {data.length === 0 && (
            <p className="text-center text-base sm:text-lg text-muted-foreground">
              No addstocks found.
            </p>
          )}
        </div>
      )}

      <div className="h-16" />
    </main>
  );
}
