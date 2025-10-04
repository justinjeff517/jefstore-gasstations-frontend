"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CheckCircle2, FilePlus2, X } from "lucide-react";

type FuelPO = {
  id: string;
  type: string;
  tin: string;
  created_by: string;
  creator_employee_number: string;
  created: any;
  date: any;
  fuel?: {
    plate_number?: string;
    route?: string;
    driver?: string;
    product?: string;
    quantity?: number;
  };
  po_number: string;
};

export default function Page() {
  const [verifying, setVerifying] = useState(false);
  const [poNumber, setPoNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FuelPO | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onVerifySubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    if (!poNumber.trim()) return;

    setLoading(true);
    try {
      const url = `/api/purchase-orders/verify?po_number=${encodeURIComponent(poNumber.trim())}`;
      const r = await fetch(url, { method: "GET", cache: "no-store" });
      const data = await r.json();

      if (!r.ok) {
        const msg = typeof data === "object" && data?.error ? data.error : "Verification failed";
        setError(msg);
      } else {
        setResult(data as FuelPO);
      }
    } catch (err: any) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-3xl p-4">
      <div className="mb-4 flex items-center gap-3">
        <Button asChild variant="ghost" className="px-2">
          <Link href="/purchase-orders">
            <ArrowLeft className="h-5 w-5" aria-hidden />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-xl font-semibold">Add Internal PO</h1>
      </div>

      <div className="flex flex-col gap-4">
        <Card className="rounded-2xl">
          <CardHeader className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6" aria-hidden />
              <CardTitle className="text-lg">Verify PO Number</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground">
              Check if an internal PO already exists and is valid.
            </p>
          </CardHeader>

          <CardContent className="grid gap-4">
            {!verifying ? (
              <Button className="h-12 w-full text-base" onClick={() => setVerifying(true)}>
                Verify PO
              </Button>
            ) : (
              <form onSubmit={onVerifySubmit} className="grid gap-3">
                <div className="grid gap-2">
                  <Label htmlFor="po-number">PO Number</Label>
                  <Input
                    id="po-number"
                    inputMode="numeric"
                    autoFocus
                    placeholder="e.g. 11996189"
                    value={poNumber}
                    onChange={(e) => setPoNumber(e.currentTarget.value)}
                    className="h-12 text-base"
                    required
                  />
                </div>

                <div className="flex w-full gap-2">
                  <Button
                    type="submit"
                    className="h-12 flex-1 text-base"
                    disabled={loading || !poNumber.trim()}
                  >
                    {loading ? "Verifying..." : "Continue"}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-12 flex-1 text-base"
                    onClick={() => {
                      setVerifying(false);
                      setPoNumber("");
                      setResult(null);
                      setError(null);
                      setLoading(false);
                    }}
                  >
                    <X className="mr-2 h-5 w-5" aria-hidden />
                    Cancel
                  </Button>
                </div>
              </form>
            )}

            {error && (
              <div className="text-sm text-red-600">
                {error}
              </div>
            )}

            {result && (
              <div className="rounded-lg border p-3 text-sm">
                <div className="mb-2 font-medium">Result</div>
                <div className="grid gap-1">
                  <div>PO #: <span className="font-mono">{result.po_number}</span></div>
                  <div>Type: {result.type}</div>
                  {result.fuel && (
                    <>
                      <div>Vehicle: {result.fuel.plate_number || "—"}</div>
                      <div>Route: {result.fuel.route || "—"}</div>
                      <div>Driver: {result.fuel.driver || "—"}</div>
                      <div>Product: {result.fuel.product || "—"}</div>
                      <div>Qty: {result.fuel.quantity ?? "—"}</div>
                    </>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader className="space-y-2">
            <div className="flex items-center gap-2">
              <FilePlus2 className="h-6 w-6" aria-hidden />
              <CardTitle className="text-lg">Create PO</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground">
              Start a new internal purchase order from scratch.
            </p>
          </CardHeader>
          <CardContent>
            <Button asChild variant="secondary" className="h-12 w-full text-base">
              <Link href="/purchase-orders/add-internal/create">Create New PO</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
