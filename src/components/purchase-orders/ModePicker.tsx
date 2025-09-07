"use client";

import Link from "next/link";
import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Keycap } from "@/components/Keycap";

type Props = { dispenserId: string; baseNozzle: string };

const hrefFor = (d: string, n: string, m: "auto" | "manual") =>
  `/purchase-orders/${d}?nozzle=${n}/${m}`;

export default function ModePicker({ dispenserId, baseNozzle = "regular" }: Props) {
  const router = useRouter();

  const toAuto = useCallback(
    () => router.push(hrefFor(dispenserId, baseNozzle, "auto")),
    [router, dispenserId, baseNozzle]
  );
  const toManual = useCallback(
    () => router.push(hrefFor(dispenserId, baseNozzle, "manual")),
    [router, dispenserId, baseNozzle]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable)) return;

      if (e.key === "1" || e.code === "Digit1" || e.code === "Numpad1") {
        e.preventDefault();
        toAuto();
      } else if (e.key === "2" || e.code === "Digit2" || e.code === "Numpad2") {
        e.preventDefault();
        toManual();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toAuto, toManual]);

  const autoHref = hrefFor(dispenserId, baseNozzle, "auto");
  const manualHref = hrefFor(dispenserId, baseNozzle, "manual");

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Press <Keycap label="1" /> for Auto or <Keycap label="2" /> for Manual.
      </p>

      <div className="grid grid-cols-2 gap-2">
        <Button asChild className="w-full">
          <Link href={autoHref}>
            Auto <span className="ml-2"><Keycap label="1" /></span>
          </Link>
        </Button>

        <Button asChild variant="secondary" className="w-full">
          <Link href={manualHref}>
            Manual <span className="ml-2"><Keycap label="2" /></span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
