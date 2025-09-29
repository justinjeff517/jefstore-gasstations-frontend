"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CheckCircle2, FilePlus2, X } from "lucide-react";

export default function Page() {
  const [verifying, setVerifying] = useState(false);
  const [poNumber, setPoNumber] = useState("");

  function onVerifySubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: handle verify action (e.g., router.push or API call)
    // router.push(`/purchase-orders/add-internal/verify?po=${encodeURIComponent(poNumber)}`)
  }

  return (
    <main className="mx-auto w-full max-w-3xl p-4">
      {/* Header / Back */}
      <div className="mb-4 flex items-center gap-3">
        <Button asChild variant="ghost" className="px-2">
          <Link href="/purchase-orders">
            <ArrowLeft className="h-5 w-5" aria-hidden />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-xl font-semibold">Add Internal PO</h1>
      </div>

      {/* Two rows (mobile-first) */}
      <div className="flex flex-col gap-4">
        {/* Row 1: Verify PO Number */}
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

          <CardContent>
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
                    inputMode="text"
                    autoFocus
                    placeholder="e.g. PO-1025"
                    value={poNumber}
                    onChange={(e) => setPoNumber(e.currentTarget.value)}
                    className="h-12 text-base"
                    required
                  />
                </div>

                <div className="flex w-full gap-2">
                  <Button type="submit" className="h-12 flex-1 text-base" disabled={!poNumber.trim()}>
                    Continue
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-12 flex-1 text-base"
                    onClick={() => {
                      setVerifying(false);
                      setPoNumber("");
                    }}
                  >
                    <X className="mr-2 h-5 w-5" aria-hidden />
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Row 2: Create PO */}
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
