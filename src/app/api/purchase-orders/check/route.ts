import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const po_number = searchParams.get("po_number");
  if (!po_number) return NextResponse.json({ error: "Missing po_number" }, { status: 400 });

  const url = new URL("https://faas-sgp1-18bc02ac.doserverless.co/api/v1/web/fn-86217a9f-1135-4904-b49a-fe070d4e10c7/purchase-orders/get-fuel-by-po-number");
  url.searchParams.set("po_number", po_number);

  try {
    const r = await fetch(url.toString(), { headers: { Accept: "application/json" }, cache: "no-store" });
    const text = await r.text();
    const data = (() => { try { return JSON.parse(text); } catch { return text; } })();
    if (!r.ok) return NextResponse.json({ error: "Upstream request failed", status: r.status, body: data }, { status: r.status });
    return NextResponse.json(data, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: "Upstream fetch error", message: e?.message ?? String(e) }, { status: 502 });
  }
}
