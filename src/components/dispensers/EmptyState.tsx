//src/components/dispensers/EmptyState.tsx
"use client";

import { Fuel } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed p-6 text-center">
      <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
        <Fuel className="h-5 w-5 text-muted-foreground" />
      </div>
      <p className="text-sm font-medium">No dispensers found</p>
      <p className="mt-1 text-xs text-muted-foreground">Check your location setting or try refreshing.</p>
    </div>
  );
}
