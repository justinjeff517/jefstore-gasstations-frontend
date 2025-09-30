"use client";

import React from "react";

export function Row({ label, children }: { label: string; children?: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="rounded-md border bg-muted/40 px-3 py-2 text-sm font-medium">{children ?? "—"}</div>
    </div>
  );
}
