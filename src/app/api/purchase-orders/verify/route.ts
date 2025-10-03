// app/api/purchase-orders/get-fuel-by-po-number/route.ts
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const po_number = searchParams.get("po_number");

  if (!po_number) {
    return NextResponse.json({ error: "Missing po_number" }, { status: 400 });
  }

  const upstream =
    "https://faas-sgp1-18bc02ac.doserverless.co/api/v1/web/fn-86217a9f-1135-4904-b49a-fe070d4e10c7/purchase-orders/get-fuel-by-po-number";

  try {
    const r = await fetch(upstream, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ po_number }),
    });

    if (!r.ok) {
      const text = await r.text();
      return NextResponse.json(
        { error: "Upstream request failed", status: r.status, body: text },
        { status: 502 }
      );
    }

    const data = await r.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      { error: "Internal error", details: err.message },
      { status: 500 }
    );
  }
}
