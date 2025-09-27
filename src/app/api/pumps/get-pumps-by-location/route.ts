import { NextResponse } from "next/server";

const BASE =
  "https://faas-sgp1-18bc02ac.doserverless.co/api/v1/web/fn-d2428264-d75d-40c6-9c56-b265528c57f9/pumps/get-pumps-by-location";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const location = searchParams.get("location");
  if (!location) {
    return NextResponse.json({ error: "location is required" }, { status: 400 });
  }

  const url = `${BASE}?${new URLSearchParams({ location }).toString()}`;

  try {
    const r = await fetch(url, { cache: "no-store" });
    if (!r.ok) {
      const text = await r.text().catch(() => "");
      return NextResponse.json(
        { error: "Upstream error", status: r.status, body: text },
        { status: 502 }
      );
    }
    const data = await r.json();
    return NextResponse.json(data, {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Fetch failed" }, { status: 502 });
  }
}
