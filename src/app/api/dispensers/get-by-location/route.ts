export const dynamic = "force-dynamic"

const BASE_URL =
  process.env.DISPENSERS_API_URL ??
  "https://faas-sgp1-18bc02ac.doserverless.co/api/v1/web/fn-d2428264-d75d-40c6-9c56-b265528c57f9/dispensers/get-by-location"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const location = searchParams.get("location") || ""
    if (!location) {
      return new Response(JSON.stringify({ error: "location is required" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      })
    }

    const upstream = `${BASE_URL}?location=${encodeURIComponent(location)}`
    const resp = await fetch(upstream, { cache: "no-store" })

    if (!resp.ok) {
      return new Response(
        JSON.stringify({ error: "Upstream error", status: resp.status }),
        { status: 502, headers: { "content-type": "application/json" } }
      )
    }

    const data = await resp.json()
    return Response.json(data)
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || "Server error" }), {
      status: 500,
      headers: { "content-type": "application/json" },
    })
  }
}
