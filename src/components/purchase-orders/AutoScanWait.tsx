"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

type LatestScan = { scan_id: string; code: string; created_at?: string; source?: string };

type Props = { dispenserId: string; baseNozzle: string; manualHref: string; backHref: string };

export default function AutoScanWait({ dispenserId, baseNozzle, manualHref, backHref }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState("Waiting for QR from scanner…");
  const [lastId, setLastId] = useState<string | null>(null);
  const [lastTime, setLastTime] = useState<string | null>(null);
  const [qrInput, setQrInput] = useState("");
  const timerRef = useRef<NodeJS.Timer | null>(null);

  async function resolveAndGo(code: string) {
    if (!code) return;
    setStatus("Resolving QR…");
    try {
      const r = await fetch(`/api/po/resolve-qr?code=${encodeURIComponent(code)}`, { cache: "no-store" });
      if (!r.ok) {
        setStatus("QR not recognized. Still waiting…");
        return;
      }
      const data = await r.json();
      sessionStorage.setItem("po.prefill", JSON.stringify(data));
      router.push(manualHref);
    } catch {
      setStatus("Network error. Still waiting…");
    }
  }

  async function fetchLatest() {
    try {
      const r = await fetch(
        `/api/scanned_qr/latest?dispenser=${encodeURIComponent(dispenserId)}&nozzle=${encodeURIComponent(baseNozzle)}`,
        { cache: "no-store" }
      );
      if (!r.ok) return;
      const s: LatestScan | null = await r.json();
      if (!s || !s.scan_id || !s.code) return;
      if (s.scan_id === lastId) return;
      setLastId(s.scan_id);
      setLastTime(new Date().toLocaleTimeString());
      resolveAndGo(s.code);
    } catch {}
  }

  useEffect(() => {
    fetchLatest();
    timerRef.current = setInterval(fetchLatest, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [dispenserId, baseNozzle, lastId]);

  return (
    <div className="grid gap-3">
      <div className="text-sm text-muted-foreground">Mode: Auto</div>
      <div className="rounded-md border p-3">
        <div className="font-medium">{status}</div>
        <div className="text-xs text-muted-foreground mt-1">Dispenser: {dispenserId} · Nozzle: {baseNozzle}</div>
        {lastTime && <div className="text-xs text-muted-foreground mt-1">Last scan received: {lastTime}</div>}
      </div>
      <div className="grid gap-1">
        <Label htmlFor="qr">Enter QR manually</Label>
        <div className="flex gap-2">
          <Input id="qr" value={qrInput} onChange={e => setQrInput(e.target.value)} placeholder="Paste or type QR" />
          <Button onClick={() => resolveAndGo(qrInput)} disabled={!qrInput.trim()}>Resolve</Button>
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="secondary" onClick={() => router.push(backHref)}>Back</Button>
        <Button onClick={() => router.push(manualHref)} className="ml-auto">Go manual</Button>
      </div>
    </div>
  );
}
