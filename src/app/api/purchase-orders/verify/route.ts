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

  const upstream =
    "https://faas-sgp1-18bc02ac.doserverless.co/api/v1/web/fn-86217a9f-1135-4904-b49a-fe070d4e10c7/purchase-orders/get-fuel-by-po-number";

  try {
    // Upstream expects po_number in the JSON body, so we POST to it.
    const r = await fetch(upstream, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ po_number }),
      // Prevent Next from caching upstream responses
      cache: "no-store",
    });

    const text = await r.text();
    let payload: any;
    try {
      payload = JSON.parse(text);
    } catch {
      payload = text;
    }

    if (!r.ok) {
      return NextResponse.json(
        { error: "Upstream request failed", status: r.status, body: payload },
        { status: r.status }
      );
    }

    return NextResponse.json(unwrap(payload));
  } catch (err: any) {
    return NextResponse.json(
      { error: "Request error", message: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}
