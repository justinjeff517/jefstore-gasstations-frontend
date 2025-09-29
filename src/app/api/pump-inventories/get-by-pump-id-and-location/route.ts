
import { NextResponse } from "next/server";

const UPSTREAM =
  "https://faas-sgp1-18bc02ac.doserverless.co/api/v1/web/fn-d2428264-d75d-40c6-9c56-b265528c57f9/pump_inventories/get-latest-by-pump-id-and-location";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const location = searchParams.get("location")?.trim();
  const pump_id = searchParams.get("pump_id")?.trim();

  if (!location || !pump_id) {
    return NextResponse.json(
      { ok: false, error: "location and pump_id are required query params" },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(UPSTREAM, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ location, pump_id }),
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { ok: false, error: "Upstream error", status: res.status, detail: text },
        { status: 502 }
      );
    }

    const data = await res.json();
    return NextResponse.json({ ok: true, data });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: "Request failed", detail: String(err?.message || err) },
      { status: 502 }
    );
  }
}
