// components/Keycap.tsx
"use client";
export function Keycap({ label, className = "" }: { label: string | number; className?: string }) {
  return (
    <span
      aria-label={`Hotkey ${label}`}
      className={[
        "inline-flex items-center justify-center",
        "h-5 min-w-[1.25rem] px-1",
        "rounded-md border border-neutral-300 bg-white shadow-sm",
        "text-[11px] font-semibold leading-none tracking-tight font-mono text-neutral-900",
        "select-none",
        className,
      ].join(" ")}
    >
      {label}
    </span>
  );
}
