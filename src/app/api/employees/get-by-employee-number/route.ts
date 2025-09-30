import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // disable caching
export const runtime = "edge"; // optional: use 'nodejs' if you need Node APIs

const UPSTREAM =
  "https://faas-sgp1-18bc02ac.doserverless.co/api/v1/web/fn-86217a9f-1135-4904-b49a-fe070d4e10c7/employees/get-by-employee-number";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const employee_number = searchParams.get("employee_number")?.trim();

  if (!employee_number) {
    return NextResponse.json(
      { error: "employee_number is required" },
      { status: 400 }
    );
  }

  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 8000);

  try {
    const url = `${UPSTREAM}?employee_number=${encodeURIComponent(
      employee_number
    )}`;

    const res = await fetch(url, { cache: "no-store", signal: ctrl.signal });
    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return NextResponse.json(
        { error: "Upstream error", status: res.status, data },
        { status: res.status }
      );
    }

    if (data?.found && data?.employee) {
      const e = data.employee;
      return NextResponse.json({
        found: true,
        employee: {
          id: e.id,
          employee_number: e.employee_number,
          first_name: e.first_name,
          last_name: e.last_name,
          full_name: `${e.first_name ?? ""} ${e.last_name ?? ""}`.trim(),
          uid: e.uid,
          created: e.created ?? e.created_at,
        },
      });
    }

    return NextResponse.json({ found: false }, { status: 404 });
  } catch (err: any) {
    const aborted = err?.name === "AbortError";
    return NextResponse.json(
      { error: aborted ? "Upstream timeout" : "Request failed" },
      { status: 502 }
    );
  } finally {
    clearTimeout(t);
  }
}
