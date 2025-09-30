"use client";

import { useMemo, useEffect, useState, useRef } from "react";
import { Input } from "@/components/ui/input";

type Props = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
};

type Status = "idle" | "checking" | "success" | "notfound" | "error";

export default function EmpoyeeNumberField({ label, value, onChange, placeholder = "00000" }: Props) {
  const [status, setStatus] = useState<Status>("idle");
  const [fullName, setFullName] = useState<string>("");
  const abortRef = useRef<AbortController | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    if (abortRef.current) abortRef.current.abort();

    if (value.length < 5) {
      setStatus("idle");
      setFullName("");
      return;
    }

    setStatus("checking");
    timerRef.current = window.setTimeout(async () => {
      try {
        abortRef.current = new AbortController();
        const res = await fetch(`/api/employees/get-by-employee-number?employee_number=${value}`, {
          signal: abortRef.current.signal,
        });
        const json = await res.json();
        if (json?.found && json?.employee?.full_name) {
          setFullName(json.employee.full_name as string);
          setStatus("success");
        } else {
          setFullName("");
          setStatus("notfound");
        }
      } catch {
        if (abortRef.current?.signal.aborted) return;
        setFullName("");
        setStatus("error");
      }
    }, 350);

  return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      if (abortRef.current) abortRef.current.abort();
    };
  }, [value]);

  const hint = useMemo(() => {
    if (value.length === 0) return "Enter 5 digits";
    if (value.length < 5) return `${5 - value.length} more digit${5 - value.length === 1 ? "" : "s"}`;
    if (status === "checking") return "Checking…";
    if (status === "success") return fullName; // name shown here
    if (status === "notfound") return "Employee Not Found";
    if (status === "error") return "Unable to verify right now";
    return "✓ 5 digits";
  }, [value, status, fullName]);

  // Bigger font when success
  const sizeClass =
    status === "success" ? "text-base md:text-lg font-semibold" : "text-xs";

  const colorClass =
    status === "success"
      ? "text-emerald-500"
      : status === "notfound"
      ? "text-destructive"
      : status === "checking"
      ? "text-muted-foreground"
      : value.length === 5
      ? "text-foreground"
      : "text-muted-foreground";

  return (
    <div className="space-y-1">
      <div className="text-xs text-muted-foreground">{label}</div>
      <Input
        value={value}
        inputMode="numeric"
        maxLength={5}
        onInput={(e) => {
          const digitsOnly = (e.currentTarget.value || "").replace(/\D/g, "").slice(0, 5);
          e.currentTarget.value = digitsOnly;
          onChange(digitsOnly);
        }}
        onChange={(e) => onChange(e.currentTarget.value)}
        placeholder={placeholder}
      />
      <div className={`mt-1 ${sizeClass} ${colorClass}`}>{hint}</div>
    </div>
  );
}
