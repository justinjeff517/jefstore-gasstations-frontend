// app/api/purchase-orders/get-fuel-by-po-number/route.ts
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function unwrap(data: any) {
  if (data && typeof data === "object" && "body" in data) {
    try {
      return JSON.parse((data as any).body);
    } catch {
      return (data as any).body;
    }
  }
  return data;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const po_number = searchParams.get("po_number");
  if (!po_number) {
    return NextResponse.json({ error: "Missing po_number" }, { status: 400 });
  }

  // ✅ Use the full namespace/package/function path that works
  const upstream = `https://faas-sgp1-18bc02ac.doserverless.co/api/v1/web/fn-86217a9f-1135-4904-b49a-fe070d4e10c7/purchase-orders/get-fuel-by-po-number?po_number=${encodeURIComponent(po_number)}`;

  try {
    const r = await fetch(upstream, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    const text = await r.text();
    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = { raw: text };
    }

    if (!r.ok) {
      // Pass through DO error payload (e.g., "Incomplete web function path")
      return NextResponse.json(
        { error: "Upstream request failed", status: r.status, body: parsed },
        { status: r.status }
      );
    }

    return NextResponse.json(unwrap(parsed), { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { error: "Upstream fetch error", message: e?.message ?? String(e) },
      { status: 502 }
    );
  }
}
