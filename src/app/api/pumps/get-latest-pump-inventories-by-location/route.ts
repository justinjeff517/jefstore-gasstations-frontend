// app/api/pumps/get-latest-by-location/route.ts
import { NextRequest, NextResponse } from "next/server";

const BASE = "https://faas-sgp1-18bc02ac.doserverless.co/api/v1/web/fn-d2428264-d75d-40c6-9c56-b265528c57f9";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const location = searchParams.get("location");
  if (!location) {
    return NextResponse.json({ error: "Missing ?location" }, { status: 400 });
  }

  const upstream = `${BASE}/pumps/get-latest-pump-inventories-by-location?location=${encodeURIComponent(location)}`;

  try {
    const res = await fetch(upstream, { cache: "no-store" });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return NextResponse.json({ error: "Upstream error", status: res.status, body: text }, { status: 502 });
    }
    const data = await res.json();
    return NextResponse.json(data, {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err: any) {
    return NextResponse.json({ error: "Request failed", message: String(err?.message || err) }, { status: 500 });
  }
}
