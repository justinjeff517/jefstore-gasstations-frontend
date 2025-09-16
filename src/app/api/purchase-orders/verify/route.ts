// src/app/api/purchase-orders/get-one/route.ts
import { NextResponse } from "next/server"

const BASE_URL =
  "https://faas-sgp1-18bc02ac.doserverless.co/api/v1/web/fn-d2428264-d75d-40c6-9c56-b265528c57f9"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const po_number = searchParams.get("po_number")

  if (!po_number) {
    return NextResponse.json(
      { error: "Missing 'po_number' parameter" },
      { status: 400 }
    )
  }

  try {
    const resp = await fetch(
      `${BASE_URL}/purchase_orders/get-one?po_number=${encodeURIComponent(
        po_number
      )}`,
      { cache: "no-store" }
    )

    const data = await resp.json()
    return NextResponse.json(data, { status: resp.status })
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch purchase order" },
      { status: 500 }
    )
  }
}
