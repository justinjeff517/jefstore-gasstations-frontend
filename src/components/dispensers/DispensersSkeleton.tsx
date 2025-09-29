//src/components/dispensers/DispensersSkeleton.tsx
"use client";

export default function DispensersSkeleton() {
  return (
    <div className="space-y-2.5">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="rounded-2xl border shadow-sm">
          <div className="px-4 py-3">
            <div className={`h-4 ${i%2? "w-28":"w-40"} animate-pulse rounded bg-muted`} />
          </div>
          <div className="grid grid-cols-1 gap-2 px-3 pb-3">
            {[...Array(2)].map((_, j) => (
              <div key={j} className={`h-10 animate-pulse rounded-xl bg-muted/60 ${j%2? "w-full":"w-5/6"}`} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
