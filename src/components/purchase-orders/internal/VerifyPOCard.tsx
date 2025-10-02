/* src/components/purchase-orders/internal/VerifyPOCard.tsx */
"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, X } from "lucide-react";
import type { FuelPO } from "./types";

type Props = {
  onVerified: (po: FuelPO) => void;
  onError?: (msg: string | null) => void;
};

type Status = "idle" | "found" | "not_found";

export default function VerifyPOCard({ onVerified, onError }: Props) {
  const [verifying, setVerifying] = useState(false);
  const [poNumber, setPoNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  function sanitize(val: string) {
    return val.replace(/\D/g, "").slice(0, 8);
  }

  function markNotFound() {
    const msg = "PO Number Not Found";
    setStatus("not_found");
    setError(msg);
    onError?.(msg);
  }

  async function verify(po: string) {
    if (po.length !== 8 || loading) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setError(null);
    onError?.(null);
    setLoading(true);
    setStatus("idle");

    try {
      const url = `/api/purchase-orders/verify?po_number=${encodeURIComponent(po)}`;
      const r = await fetch(url, { method: "GET", cache: "no-store", signal: controller.signal });

      let data: any;
      try {
        data = await r.json();
      } catch {
        data = { error: await r.text() };
      }

      if (!r.ok || (data && typeof data === "object" && data.error)) {
        return markNotFound();
      }

      const looksFuel =
        data &&
        typeof data === "object" &&
        data.type === "fuel" &&
        typeof data.po_number === "string" &&
        data.po_number.length === 8;

      if (!looksFuel) return markNotFound();

      setStatus("found");
      onVerified(data as FuelPO);
    } catch (e: any) {
      if (e?.name !== "AbortError") {
        setStatus("idle");
        setError("Network error. Please try again.");
        onError?.("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (poNumber.length === 8) verify(poNumber);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poNumber]);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = sanitize(e.currentTarget.value);
    setPoNumber(v);
    if (error) {
      setError(null);
      onError?.(null);
    }
    if (status !== "idle") setStatus("idle");
  }

  async function onVerifySubmit(e: React.FormEvent) {
    e.preventDefault();
    if (poNumber.length === 8) verify(poNumber);
  }

  const cardColorClasses =
    status === "found"
      ? "border-green-500 bg-green-50/60 ring-1 ring-green-200"
      : status === "not_found"
      ? "border-red-500 bg-red-50/60 ring-1 ring-red-200"
      : "";

  const iconColorClasses =
    status === "found" ? "text-green-600" : status === "not_found" ? "text-red-600" : "";

  return (
    <Card className={`rounded-2xl transition-colors ${cardColorClasses}`}>
      <CardHeader className="space-y-2">
        <div className="flex items-center gap-2">
          <CheckCircle2 className={`h-6 w-6 ${iconColorClasses}`} aria-hidden />
          <CardTitle className="text-lg">Verify PO Number</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">
          Check if an internal PO already exists and is valid.
        </p>
      </CardHeader>

      <CardContent className="grid gap-4">
        {!verifying ? (
          <Button
            className="h-12 w-full text-base"
            onClick={() => setVerifying(true)}
            disabled={loading}
          >
            Verify PO
          </Button>
        ) : (
          <form onSubmit={onVerifySubmit} className="grid gap-3">
            <div className="grid gap-2">
              <Label htmlFor="po-number">PO Number</Label>
              <Input
                id="po-number"
                inputMode="numeric"
                pattern="\d{8}"
                maxLength={8}
                autoFocus
                placeholder="Enter 8-digit PO (e.g. 11996189)"
                value={poNumber}
                onChange={onInputChange}
                className="h-12 text-base tracking-widest"
                aria-invalid={!!error}
                aria-describedby={error ? "po-error" : undefined}
                required
              />
            </div>

            <div className="flex w-full gap-2">
              <Button
                type="submit"
                className="h-12 flex-1 text-base"
                disabled={loading || poNumber.length !== 8}
                aria-busy={loading}
              >
                {loading ? "Verifying..." : "Continue"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="h-12 flex-1 text-base"
                onClick={() => {
                  abortRef.current?.abort();
                  setVerifying(false);
                  setPoNumber("");
                  setError(null);
                  setStatus("idle");
                  onError?.(null);
                }}
              >
                <X className="mr-2 h-5 w-5" aria-hidden />
                Cancel
              </Button>
            </div>
          </form>
        )}

        {error && (
          <div id="po-error" className="text-sm text-red-600" aria-live="polite">
            {error}
          </div>
        )}
        {verifying && !error && poNumber.length > 0 && poNumber.length < 8 && (
          <div className="text-xs text-muted-foreground">
            {8 - poNumber.length} more digit{8 - poNumber.length === 1 ? "" : "s"} to verify…
          </div>
        )}
      </CardContent>
    </Card>
  );
}
