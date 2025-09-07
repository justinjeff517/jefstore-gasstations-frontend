"use client";

import { useId } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type Props = {
  value: string;
  onChange: (v: string) => void;
  label?: string;
  required?: boolean;
  id?: string;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  error?: string | null;
};

export default function QuantityField({
  value,
  onChange,
  label = "Quantity (Liters)",
  required,
  id,
  min = 0.01,
  max,
  step = 0.01,
  disabled,
  error,
}: Props) {
  const autoId = useId();
  const inputId = id ?? `qty-${autoId}`;
  const errId = `${inputId}-err`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    // Allow empty (to let user clear), digits, one dot
    if (raw === "" || /^[0-9]*([.][0-9]*)?$/.test(raw)) {
      onChange(raw);
    }
  };

  const handleBlur = () => {
    if (value === "") return;
    const n = Number(value);
    if (Number.isNaN(n)) return;
    let clamped = n;
    if (min !== undefined) clamped = Math.max(min, clamped);
    if (max !== undefined) clamped = Math.min(max, clamped);
    // Normalize to up to 2 decimals without forcing trailing zeros
    const normalized =
      Math.round(clamped * 100) % 1 === 0
        ? String(Math.round(clamped * 100) / 100)
        : clamped.toFixed(2).replace(/\.?0+$/, "");
    onChange(normalized);
  };

  return (
    <div className="grid gap-1">
      <Label htmlFor={inputId}>
        {label} {required ? <span className="text-red-600">*</span> : null}
      </Label>
      <div className="relative">
        <Input
          id={inputId}
          type="text"
          inputMode="decimal"
          placeholder="0.00"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={!!error}
          aria-describedby={error ? errId : undefined}
          disabled={disabled}
          className={error ? "pr-16 border-red-500" : "pr-16"}
        />
        <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-xs text-muted-foreground">
          liters
        </span>
      </div>
      {error ? (
        <p className="mt-1 text-xs text-red-600" id={errId}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
