// app/api/addstocks/get-all/route.ts
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const upstream = "https://faas-sgp1-18bc02ac.doserverless.co/api/v1/web/fn-d2428264-d75d-40c6-9c56-b265528c57f9/addstocks/get-all";

  try {
    const r = await fetch(upstream, { method: "GET", cache: "no-store" });
    const contentType = r.headers.get("content-type") || "";
    const data = contentType.includes("application/json") ? await r.json() : await r.text();

    if (!r.ok) {
      return NextResponse.json(
        { error: "Upstream request failed", status: r.status, body: data },
        { status: r.status }
      );
    }

    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Network or parsing error", message: String(err?.message || err) },
      { status: 502 }
    );
  }
}
