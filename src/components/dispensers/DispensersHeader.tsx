//src/components/dispensers/DispensersHeader.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Fuel, RotateCw } from "lucide-react";

type Props = {
  location: string;
  loading: boolean;
  onRefresh: () => void;
  disabled?: boolean;
};

export default function DispensersHeader({ location, loading, onRefresh, disabled }: Props) {
  return (
    <header className="mb-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="rounded-lg bg-primary/10 p-2">
          <Fuel className="h-5 w-5 text-primary" aria-hidden />
        </div>
        <div className="leading-tight">
          <h1 className="text-lg font-semibold tracking-tight">Dispensers</h1>
          <p className="text-[11px] text-muted-foreground">
            {location ? `Location: ${location}` : "Location: —"}
          </p>
        </div>
      </div>
      <Button
        size="icon"
        variant="outline"
        className="h-9 w-9 rounded-xl"
        onClick={onRefresh}
        aria-label="Refresh"
        disabled={loading || disabled}
        title={!location ? "Set location first" : "Refresh"}
      >
        <RotateCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
      </Button>
    </header>
  );
}
