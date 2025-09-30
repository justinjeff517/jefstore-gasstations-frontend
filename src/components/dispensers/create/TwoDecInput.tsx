"use client";

import { Input } from "@/components/ui/input";

type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
};

const clean2 = (s: string) => {
  if (!s) return "";
  // keep digits and dots, then allow only the first dot
  let raw = s.replace(/[^\d.]/g, "");
  const firstDot = raw.indexOf(".");
  if (firstDot !== -1) {
    raw = raw.slice(0, firstDot + 1) + raw.slice(firstDot + 1).replace(/\./g, "");
  }
  const trailingDot = raw.endsWith(".");
  const [i = "", f = ""] = raw.split(".");
  // if user starts with ".", treat as "0."
  const int = (raw.startsWith(".") ? "0" : i.replace(/^0+(?=\d)/, "")) || "0";
  return trailingDot ? `${int}.` : f ? `${int}.${f.slice(0, 2)}` : int;
};

export function TwoDecInput({ value, onChange, placeholder = "0.00" }: Props) {
  return (
    <Input
      value={value}
      inputMode="decimal"
      placeholder={placeholder}
      onChange={(e) => onChange(clean2(e.currentTarget.value))}
      onBlur={(e) => {
        let v = clean2(e.currentTarget.value);
        if (!v || v === ".") v = "0";
        if (v.endsWith(".")) v = v.slice(0, -1);
        const n = Number(v);
        onChange(Number.isFinite(n) ? n.toFixed(2) : "0.00");
      }}
      pattern="^\d+(\.\d{1,2})?$"
    />
  );
}
